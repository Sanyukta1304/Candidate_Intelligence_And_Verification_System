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

    // 5. Resume scoring - Read actual resume file and score it
    let resumeText = "";
    let extractedSkills = [];
    
    if (candidate.resume_url) {
      // Read resume file from uploads folder
      resumeText = await getResumeText(candidate.resume_url);
      console.log(`[Orchestrator] Resume text extracted: ${resumeText.length} characters`);
      
      // ✅ Extract skills from the resume content (semantic-based)
      extractedSkills = extractSkillsFromResume(resumeText);
      console.log(`[Orchestrator] Extracted ${extractedSkills.length} skills from resume:`, extractedSkills);
      
      // Store extracted skills in candidate
      candidate.extracted_skills = extractedSkills;
    }
    
    const resumeResult = scoreResume(resumeText || "");

    const atsScore =
      resumeResult && typeof resumeResult.total_ats_score === "number"
        ? resumeResult.total_ats_score
        : 0;

    const resumeContribution = Math.round((atsScore / 100) * 30);

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