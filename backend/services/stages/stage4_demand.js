/**
 * Stage 4: Market Demand Weight Lookup
 * Assigns demand weights based on tier classification and role multipliers
 */

const { DEMAND_TIERS, ROLE_MULTIPLIERS } = require('../data/demandTiers');

function stage4_demand(skillsResult, detectedRole) {
  const demandWeightMap = {};

  // Build tier lookup for fast access
  const skillToTier = {};
  for (const [tierName, tierData] of Object.entries(DEMAND_TIERS)) {
    tierData.skills.forEach(skill => {
      skillToTier[skill.toLowerCase()] = {
        tier: tierName,
        weight: tierData.weight
      };
    });
  }

  // Assign demand weights
  for (const skill of skillsResult.skills_detected) {
    let baseWeight = 0.5; // Default fallback weight
    
    // Look up skill in tiers
    const skillLower = skill.toLowerCase();
    if (skillToTier[skillLower]) {
      baseWeight = skillToTier[skillLower].weight;
    }

    // Apply role multiplier if available
    let finalWeight = baseWeight;
    if (ROLE_MULTIPLIERS[detectedRole]) {
      const roleMultiplier = ROLE_MULTIPLIERS[detectedRole];
      if (roleMultiplier[skill]) {
        finalWeight = baseWeight * roleMultiplier[skill];
      }
    }

    // Clamp weight between 0.5 and 1.2
    finalWeight = Math.max(0.5, Math.min(1.2, finalWeight));

    demandWeightMap[skill] = {
      base_weight: baseWeight,
      final_weight: finalWeight
    };
  }

  return {
    demand_weight_map: demandWeightMap,
    role_applied: detectedRole
  };
}

module.exports = { stage4_demand };
