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

      project.project_score = result.project_score;
      project.score_breakdown = result.score_breakdown;
      project.verified = result.verified;
      project.verified_at = new Date();

      await project.save();
    }

    // 4. Filter verified projects
    const verifiedProjects = projects.filter((p) => p.verified);

    // 5. Resume scoring (from existing service)
    const resumeResult = scoreResume(candidate.resume_text || "");
    const resumeContribution = Math.round(
      (resumeResult.total_ats_score / 100) * 30
    );

    // 6. Skills scoring
    const { scoredSkills, skills_score } = scoreSkills(
      candidate.skills,
      candidate.resume_text,
      verifiedProjects
    );

    // 7. Projects contribution
    const avgProjectScore =
      verifiedProjects.length > 0
        ? verifiedProjects.reduce((sum, p) => sum + p.project_score, 0) /
          verifiedProjects.length
        : 0;

    const projectsContribution = Math.round((avgProjectScore / 100) * 30);

    // 8. Final total score
    const totalScore =
      resumeContribution + skills_score + projectsContribution;

    // 9. Update candidate
    candidate.resume_score = resumeContribution;
    candidate.skills_score = skills_score;
    candidate.projects_score = projectsContribution;
    candidate.total_score = totalScore;
    candidate.skills = scoredSkills;
    candidate.last_scored = new Date();

    await candidate.save();

    // 10. Store resume score separately
    await ResumeScore.findOneAndUpdate(
      { candidate_id: candidateId },
      {
        ...resumeResult,
        scored_at: new Date(),
      },
      { upsert: true, new: true }
    );

    return {
      resume_score: resumeContribution,
      skills_score,
      projects_score: projectsContribution,
      total_score: totalScore,
    };
  } catch (error) {
    console.error("Orchestrator Error:", error.message);
    throw error;
  }
}

module.exports = {
  orchestrate,
};