/**
 * Stage 5: Usage Context Analysis
 * Analyzes action verbs, section context multipliers, and temporal decay
 */

const { TIER_A, TIER_B, TIER_C } = require('../data/actionVerbs');

function stage5_usage(parseResult, sectionResult, skillsResult) {
  const text = parseResult.raw_text.toLowerCase();
  const sections = sectionResult.sections;

  // Build action verb lookup
  const tierAVerbs = new Set(TIER_A.verbs.map(v => v.toLowerCase()));
  const tierBVerbs = new Set(TIER_B.verbs.map(v => v.toLowerCase()));
  const tierCVerbs = new Set(TIER_C.verbs.map(v => v.toLowerCase()));

  // Section multipliers (impact of mention in different sections)
  const sectionMultipliers = {
    EXPERIENCE: 1.0,
    PROJECTS: 0.9,
    SUMMARY: 0.6,
    SKILLS: 0.3,
    EDUCATION: 0.4,
    CERTIFICATIONS: 0.35,
    AWARDS: 0.5
  };

  const usageScoreMap = {};

  // For each skill, calculate usage score
  for (const skill of skillsResult.skills_detected) {
    let usageScore = 1.0; // Base score
    let verbBonus = 0;
    let sectionScore = 0;

    // Check which sections mention this skill
    const sectionMatrix = skillsResult.skill_section_matrix[skill] || {};
    
    for (const [section, count] of Object.entries(sectionMatrix)) {
      const sectionContent = sections[section] || '';
      if (!sectionContent) continue;

      // Check for action verbs in section
      const words = sectionContent.toLowerCase().split(/\s+/);
      
      for (const word of words) {
        if (tierAVerbs.has(word)) {
          verbBonus = Math.max(verbBonus, TIER_A.bonus);
        } else if (tierBVerbs.has(word)) {
          verbBonus = Math.max(verbBonus, TIER_B.bonus);
        } else if (tierCVerbs.has(word)) {
          verbBonus = Math.min(verbBonus, TIER_C.penalty);
        }
      }

      // Apply section multiplier
      const multiplier = sectionMultipliers[section] || 0.5;
      sectionScore += (count * multiplier);
    }

    // Combine scores
    usageScore = Math.min(2.0, usageScore + verbBonus);
    usageScore = Math.max(0.3, usageScore); // Min threshold

    usageScoreMap[skill] = {
      base_score: usageScore,
      verb_bonus: verbBonus,
      section_contribution: sectionScore,
      final_score: usageScore * (1 + sectionScore / 10)
    };
  }

  return {
    usage_score_map: usageScoreMap,
    verb_bonuses: { TIER_A: TIER_A.bonus, TIER_B: TIER_B.bonus, TIER_C: TIER_C.penalty },
    section_multipliers: sectionMultipliers
  };
}

module.exports = { stage5_usage };
