const Project = require("../models/Project");
const Candidate = require("../models/Candidate");
const { verifyRepo } = require("../services/githubVerifier");
const { scoreProject } = require("../services/projectScorer");
const { orchestrate } = require("../services/scoreOrchestrator");

const getProjects = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const projects = await Project.find({ candidate_id: candidate._id }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, github_link, tech_stack } = req.body;

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    if (!candidate.github_verified || !candidate.github_access_token || !candidate.github_username) {
      return res.status(400).json({ message: "GitHub is not connected or verified" });
    }

    let project = new Project({
      candidate_id: candidate._id,
      title,
      description,
      github_link,
      tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
    });

    project = await verifyRepo(project, candidate);

    const scoreResult = scoreProject(project);
    project.project_score = scoreResult.project_score;
    project.score_breakdown = scoreResult.score_breakdown;
    project.verified = scoreResult.verified;
    project.verified_at = new Date();

    await project.save();

    await orchestrate(candidate._id);

    res.status(201).json({
      message: "Project added and verified successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_link, tech_stack } = req.body;

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const project = await Project.findOne({ _id: id, candidate_id: candidate._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.github_link = github_link ?? project.github_link;
    project.tech_stack = Array.isArray(tech_stack) ? tech_stack : project.tech_stack;

    if (!candidate.github_verified || !candidate.github_access_token || !candidate.github_username) {
      return res.status(400).json({ message: "GitHub is not connected or verified" });
    }

    await verifyRepo(project, candidate);

    const scoreResult = scoreProject(project);
    project.project_score = scoreResult.project_score;
    project.score_breakdown = scoreResult.score_breakdown;
    project.verified = scoreResult.verified;
    project.verified_at = new Date();

    await project.save();

    await orchestrate(candidate._id);

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const project = await Project.findOneAndDelete({ _id: id, candidate_id: candidate._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await orchestrate(candidate._id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};