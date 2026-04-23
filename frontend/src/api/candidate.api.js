import axiosInstance from "./axiosInstance";

// ── Profile ──────────────────────────────────────────────────────────

/**
 * GET /api/candidate/profile
 * Returns own profile with skills (including sub-scores), computed scores, tier.
 */
export const getCandidateProfile = () =>
  axiosInstance.get("/api/candidate/profile");

/**
 * PUT /api/candidate/profile
 * Update name, about, education, skills.
 * @param {Object} data - { name?, about?, education?, skills? }
 */
export const updateCandidateProfile = (data) =>
  axiosInstance.put("/api/candidate/profile", data);

// ── Resume ───────────────────────────────────────────────────────────

/**
 * POST /api/candidate/resume
 * Upload PDF resume. Requires GitHub verification.
 * Use multipart/form-data with field name "resume".
 * Backend parses PDF, extracts text, runs ATS scorer, saves ResumeScore.
 */
export const uploadResume = (formData) =>
  axiosInstance.post("/api/candidate/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * GET /api/candidate/resume-score
 * Returns full ATS score breakdown from ResumeScore collection.
 * Response: { sections: {...}, keywords: {...}, format: {...}, total_ats_score }
 */
export const getResumeScore = () =>
  axiosInstance.get("/api/candidate/resume-score");

// ── Projects ─────────────────────────────────────────────────────────

/**
 * GET /api/projects
 * List all projects for the authenticated candidate.
 */
export const getProjects = () =>
  axiosInstance.get("/api/projects");

/**
 * POST /api/projects
 * Submit a new project. Triggers GitHub verification + scoring immediately.
 * @param {{ title, description, github_link, tech_stack[] }} data
 */
export const createProject = (data) =>
  axiosInstance.post("/api/projects", data);

/**
 * PUT /api/projects/:id
 * Update a project. Re-verification runs automatically.
 * @param {string} id - project _id
 * @param {{ title?, description?, github_link?, tech_stack[]? }} data
 */
export const updateProject = (id, data) =>
  axiosInstance.put(`/api/projects/${id}`, data);

/**
 * DELETE /api/projects/:id
 * Delete a project. Score re-orchestration triggered on backend.
 * @param {string} id - project _id
 */
export const deleteProject = (id) =>
  axiosInstance.delete(`/api/projects/${id}`);
