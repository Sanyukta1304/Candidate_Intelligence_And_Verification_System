const Candidate = require("../models/Candidate");
const Project = require("../models/Project");
const ResumeScore = require("../models/ResumeScore");

const { scoreProject } = require("./projectScorer");
const { scoreSkills } = require("./skillsScorer");
const { scoreResume } = require("./resumeScorer");

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

    // 5. Resume scoring (safe fallback if no resume uploaded)
    const resumeResult = scoreResume(candidate.resume_text || "");

    const atsScore =
      resumeResult && typeof resumeResult.total_ats_score === "number"
        ? resumeResult.total_ats_score
        : 0;

    const resumeContribution = Math.round((atsScore / 100) * 30);

    // 6. Skills scoring
    const { scoredSkills, skills_score } = scoreSkills(
      candidate.skills || [],
      candidate.resume_text || "",
      verifiedProjects
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
    candidate.last_scored = new Date();

    await candidate.save();

    // 10. Store resume score separately
    await ResumeScore.findOneAndUpdate(
      { candidate_id: candidateId },
      {
        ...(resumeResult || {}),
        total_ats_score: atsScore,
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
};