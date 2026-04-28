const fs = require("fs").promises;
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const Candidate = require("../models/Candidate");
const Project = require("../models/Project");
const ResumeScore = require("../models/ResumeScore");

const { scoreProject } = require("./projectScorer");
const { scoreSkills } = require("./skillsScorer");
const { scoreResume } = require("./resumeScorer");
const { scoreResume: scoreResumeFullPipeline } = require("./atsScorer");
const { extractSkillsFromResume } = require("./resumeSkillsExtractor");

/**
 * Read resume file from uploads folder and extract text
 * Supports PDF and DOCX formats
 */
async function getResumeText(resumeFilename) {
  if (!resumeFilename) {
    return "";
  }

  try {
    const filePath = path.join(__dirname, "../uploads/resumes", resumeFilename);
    const buffer = await fs.readFile(filePath);
    
    if (resumeFilename.toLowerCase().endsWith(".pdf")) {
      // Parse PDF
      const data = await pdfParse(buffer);
      return data.text || "";
    } else if (resumeFilename.toLowerCase().endsWith(".docx")) {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    
    return "";
  } catch (error) {
    console.error(`Error reading resume file ${resumeFilename}:`, error.message);
    return "";
  }
}

async function orchestrate(candidateId) {
  try {
    // 1. Get candidate
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // 2. Get projects
    const projects = await Project.find({ candidate_id: candidateId });

    // 3. Score each project
    for (let project of projects) {
      const result = scoreProject(project);

      project.project_score = Number(result.project_score) || 0;
      project.score_breakdown = result.score_breakdown || {};
      project.verified = result.verified || false;
      project.verified_at = new Date();

      await project.save();
    }

    // 4. Filter verified projects
    const verifiedProjects = projects.filter((p) => p.verified);

    // 5. Resume scoring - Run FULL ATS PIPELINE (all 10 stages)
    let resumeText = "";
    let extractedSkills = [];
    let atsResult = null;
    
    if (candidate.resume_url) {
      // ✅ CRITICAL: Build full file path for ATS pipeline
      const resumeFilePath = path.join(__dirname, "../uploads/resumes", candidate.resume_url);
      
      console.log(`[Orchestrator] Starting full ATS pipeline for: ${candidate.resume_url}`);
      
      // ✅ Run FULL 10-stage ATS pipeline (not just text scoring)
      atsResult = await scoreResumeFullPipeline(resumeFilePath);
      console.log(`[Orchestrator] ATS Pipeline completed. Final Score: ${atsResult.final_score}/100`);
      
      // Also get text for skill extraction
      resumeText = await getResumeText(candidate.resume_url);
      console.log(`[Orchestrator] Resume text extracted: ${resumeText.length} characters`);
      
      // ✅ Extract skills from the resume content (semantic-based)
      extractedSkills = extractSkillsFromResume(resumeText);
      console.log(`[Orchestrator] Extracted ${extractedSkills.length} skills from resume:`, extractedSkills);
      
      // Store extracted skills in candidate
      candidate.extracted_skills = extractedSkills;
    }
    
    // ✅ If full ATS pipeline ran, use its results; otherwise fall back to simple scoring
    const resumeResult = atsResult ? {
      breakdown: {
        section_score: atsResult.section_score || 0,
        keyword_score: atsResult.keyword_score || 0,
        format_score: atsResult.format_score || 0,
        skill_score: atsResult.skill_score || 0,
        project_strength: atsResult.project_strength || 0,
        ats_score: Math.min(Math.max(atsResult.final_score || 0, 0), 100)
      },
      total_ats_score: Math.min(Math.max(atsResult.final_score || 0, 0), 100)
    } : scoreResume(resumeText || "");

    // ✅ FIXED: Extract normalized ATS score from breakdown (0-100 scale)
    // This is the main ATS Score that should be displayed
    const atsScore =
      resumeResult && typeof resumeResult.breakdown?.ats_score === "number"
        ? resumeResult.breakdown.ats_score
        : 0;

    // ✅ Resume Contribution = ATS Score weighted to 0-30 range (30% of total 100 score)
    const resumeContribution = Math.round((atsScore / 100) * 30);

    // ✅ Store ATS breakdown for transparency (now with new KPI components)
    const atsBreakdown = {
      section_score: resumeResult?.breakdown?.section_score || 0,
      keyword_score: resumeResult?.breakdown?.keyword_score || 0,
      format_score: resumeResult?.breakdown?.format_score || 0,
      skill_score: resumeResult?.breakdown?.skill_score || 0,
      project_strength: resumeResult?.breakdown?.project_strength || 0,
      ats_score: atsScore,
      resume_contribution: resumeContribution,
    };

    // ✅ Extract section presence from ATS result for Section Analysis
    // This now correctly reflects remapped LANGUAGES→SKILLS
    const sectionPresence = atsResult?.section_presence || {
      summary: false,
      experience: false,
      education: false,
      skills: false,
      projects: false,
      certifications: false
    };
    
    console.log(`[Orchestrator] ✅ Section Presence from ATS:`, sectionPresence);
    console.log(`[Orchestrator] Sections detected: ${Object.values(sectionPresence).filter(Boolean).length}/6`);

    // 6. Skills scoring - Pass actual resume text and extracted skills
    const { scoredSkills, skills_score } = scoreSkills(
      candidate.skills || [],
      resumeText || "",  // ✅ FIXED: Pass actual resume text extracted from file
      verifiedProjects,
      extractedSkills    // ✅ FIXED: Pass extracted skills for validation
    );

    // 7. Projects contribution
    const avgProjectScore =
      verifiedProjects.length > 0
        ? verifiedProjects.reduce((sum, p) => sum + (Number(p.project_score) || 0), 0) /
          verifiedProjects.length
        : 0;

    const projectsContribution = Math.round((avgProjectScore / 100) * 30);

    // 8. Final total score
    const totalScore =
      (Number(resumeContribution) || 0) +
      (Number(skills_score) || 0) +
      (Number(projectsContribution) || 0);

    // 9. Update candidate
    candidate.resume_score = Number(resumeContribution) || 0;
    candidate.skills_score = Number(skills_score) || 0;
    candidate.projects_score = Number(projectsContribution) || 0;
    candidate.total_score = Number(totalScore) || 0;
    
    // ✅ FIXED: Store ATS breakdown and section presence for transparency and UI
    candidate.ats_breakdown = atsBreakdown;
    candidate.section_presence = sectionPresence;
    
    candidate.skills = scoredSkills || [];
    candidate.extracted_skills = extractedSkills;  // ✅ Store extracted skills
    candidate.last_scored = new Date();

    await candidate.save();

    // 10. Store resume score separately
    await ResumeScore.findOneAndUpdate(
      { candidate_id: candidateId },
      {
        ...(resumeResult || {}),
        total_ats_score: atsScore,
        final_score: atsScore,  // Map total_ats_score to final_score for ResumeScore model
        
        // ✅ FIXED: Store full breakdown with new KPI components
        ats_breakdown: atsBreakdown,
        components: {
          section_score: atsBreakdown.section_score,
          keyword_score: atsBreakdown.keyword_score,
          format_score: atsBreakdown.format_score,
          skill_score: atsBreakdown.skill_score,
          project_strength: atsBreakdown.project_strength,
        },
        
        scored_at: new Date(),
      },
      { upsert: true, new: true }
    );

    return {
      resume_score: Number(resumeContribution) || 0,
      skills_score: Number(skills_score) || 0,
      projects_score: Number(projectsContribution) || 0,
      total_score: Number(totalScore) || 0,
    };
  } catch (error) {
    console.error("Orchestrator Error:", error.message);
    throw error;
  }
}

module.exports = {
  orchestrate,
  getResumeText,
};