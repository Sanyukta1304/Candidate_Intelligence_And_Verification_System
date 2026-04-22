import axiosInstance from "./axiosInstance";

/**
 * Trigger full score re-orchestration for a candidate.
 * Calls: POST /api/score/trigger/:candidateId
 *
 * Used after:
 *  - Resume upload
 *  - Profile info update
 *  - Project add / edit / delete
 *  - Skills update
 *
 * Response: { success: true, data: { totalScore, tier, resumeScore, skillsScore, projectsScore } }
 */
export const triggerScore = (candidateId) =>
  axiosInstance.post(`/api/score/trigger/${candidateId}`);

/**
 * Get the latest computed score for a candidate.
 * Calls: GET /api/score/:candidateId
 *
 * Response: { success: true, data: Candidate (with scores populated) }
 */
export const getScore = (candidateId) =>
  axiosInstance.get(`/api/score/${candidateId}`);
