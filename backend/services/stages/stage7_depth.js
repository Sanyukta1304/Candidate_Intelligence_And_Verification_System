/**
 * Stage 7: Skill Depth & Coherence Scoring
 * Calculates depth multiplier and coherence factors per skill
 */

function stage7_depth(skillsResult, evidenceResult) {
  const skillSectionMatrix = skillsResult.skill_section_matrix;
  const perSkillDepth = {};
  const perSkillCoherence = {};

  // Section count multipliers
  const sectionCountMultipliers = {
    1: { min: 0.4, max: 0.7 },
    2: { min: 0.85, max: 0.95 },
    3: { min: 1.0, max: 1.0 }
  };

  let unsubstantiatedCount = 0;
  const skillsTotal = skillsResult.skills_detected.length;

  for (const skill of skillsResult.skills_detected) {
    const sectionMap = skillSectionMatrix[skill] || {};
    const sectionsCount = Object.keys(sectionMap).length;

    // Determine depth based on section distribution
    let depthMultiplier = 0.4; // Minimum depth
    let depthLevel = 'low';

    if (sectionsCount >= 3) {
      depthLevel = 'high';
      depthMultiplier = 1.0;
    } else if (sectionsCount === 2) {
      depthLevel = 'medium';
      depthMultiplier = 0.85;
    } else if (sectionsCount === 1) {
      depthLevel = 'low';
      depthMultiplier = 0.6;
    }

    // Coherence: does this skill appear in evidence-based sections?
    let coherenceFactor = 0.3; // Default low coherence
    
    const hasExperienceEvidence = (sectionMap.EXPERIENCE || 0) > 0;
    const hasProjectEvidence = (sectionMap.PROJECTS || 0) > 0;
    const hasEducationEvidence = (sectionMap.EDUCATION || 0) > 0;

    if (hasExperienceEvidence && hasProjectEvidence) {
      coherenceFactor = 1.0;
    } else if (hasExperienceEvidence || hasProjectEvidence) {
      coherenceFactor = 0.8;
    } else if (hasEducationEvidence) {
      coherenceFactor = 0.5;
    } else {
      coherenceFactor = 0.2; // Only in skills section = unsubstantiated
      unsubstantiatedCount++;
    }

    perSkillDepth[skill] = {
      section_count: sectionsCount,
      depth_level: depthLevel,
      depth_multiplier: depthMultiplier
    };

    perSkillCoherence[skill] = {
      coherence_factor: coherenceFactor,
      has_experience: hasExperienceEvidence,
      has_projects: hasProjectEvidence,
      has_education: hasEducationEvidence
    };
  }

  // Global coherence penalty: if > 60% skills are unsubstantiated
  const unsubstantiatedRatio = skillsTotal > 0 ? unsubstantiatedCount / skillsTotal : 0;
  const globalCoherencePenalty = unsubstantiatedRatio > 0.6 ? 0.5 : 1.0;

  return {
    per_skill_depth: perSkillDepth,
    per_skill_coherence: perSkillCoherence,
    global_coherence_penalty: globalCoherencePenalty,
    unsubstantiated_count: unsubstantiatedCount,
    unsubstantiated_ratio: unsubstantiatedRatio
  };
}

module.exports = { stage7_depth };
