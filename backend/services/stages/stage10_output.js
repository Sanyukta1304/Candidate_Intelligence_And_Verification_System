/**
 * Stage 10: Final Score Computation & Improvement Suggestions
 * Aggregates all dimensions, applies penalties, generates improvement suggestions
 */

function stage10_output(
  parseResult,
  sectionResult,
  skillsResult,
  demandResult,
  usageResult,
  evidenceResult,
  depthResult,
  structureResult,
  penaltyResult
) {
  // Return early if parsing failed
  if (!parseResult.parse_success) {
    return {
      final_score: 0,
      detected_role: 'Unknown',
      dimension_scores: {
        market_demand: 0,
        evidence: 0,
        skill_depth: 0,
        structure: 0,
        project_strength: 0
      },
      penalties_applied: { total: 0 },
      skills_detected: [],
      section_presence: {},
      improvement_suggestions: ['Resume could not be parsed. Please check file format.'],
      meta: {
        word_count: 0,
        char_count: 0,
        sections_detected: 0,
        skills_total: 0,
        scored_at: new Date()
      }
    };
  }

  // Calculate per-skill scores
  const skillDetailedScores = [];
  
  for (const skill of skillsResult.skills_detected) {
    const demandW = demandResult.demand_weight_map[skill]?.final_weight || 0.5;
    const usageS = usageResult.usage_score_map[skill]?.final_score || 0.5;
    const depthM = depthResult.per_skill_depth[skill]?.depth_multiplier || 0.5;
    const coherence = depthResult.per_skill_coherence[skill]?.coherence_factor || 0.3;

    // Per-skill score = demand_weight × usage_score × depth_multiplier × coherence_factor × 100
    const skillScore = Math.round(demandW * usageS * depthM * coherence * 100);

    skillDetailedScores.push({
      canonical: skill,
      demand_weight: parseFloat(demandW.toFixed(2)),
      sections_present: Object.keys(skillsResult.skill_section_matrix[skill] || {}),
      depth: depthResult.per_skill_depth[skill]?.depth_level || 'low',
      coherence: parseFloat(coherence.toFixed(2)),
      usage_score: parseFloat(usageS.toFixed(2)),
      skill_score: skillScore
    });
  }

  // Dimension scores (0-100 scale)
  const marketDemandScore = Math.round(
    (skillDetailedScores.reduce((sum, s) => sum + s.demand_weight, 0) / Math.max(skillDetailedScores.length, 1)) * 100
  );

  const evidenceScore = evidenceResult.evidence_score;

  const skillDepthScore = Math.round(
    100 * (1 - depthResult.unsubstantiated_ratio) * depthResult.global_coherence_penalty
  );

  const structureScore = structureResult.structure_score;

  // Project strength = evidence in projects section
  const projectStrengthScore = Math.round(
    Math.min(100, (evidenceResult.project_evidence / Math.max(evidenceResult.experience_evidence + evidenceResult.project_evidence, 1)) * 100)
  );

  // Weighted dimension aggregation
  const dimensionScores = {
    market_demand: Math.max(0, marketDemandScore),
    evidence: Math.max(0, evidenceScore),
    skill_depth: Math.max(0, skillDepthScore),
    structure: Math.max(0, structureScore),
    project_strength: Math.max(0, projectStrengthScore)
  };

  let finalScore = (
    (dimensionScores.market_demand * 0.30) +
    (dimensionScores.evidence * 0.25) +
    (dimensionScores.skill_depth * 0.20) +
    (dimensionScores.structure * 0.15) +
    (dimensionScores.project_strength * 0.10)
  );

  // Apply penalties
  finalScore -= penaltyResult.total_penalty;
  finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp to [0, 100]

  // Generate improvement suggestions
  const suggestions = generateSuggestions(
    sectionResult,
    skillsResult,
    evidenceResult,
    structureResult,
    penaltyResult,
    depthResult
  );

  return {
    final_score: Math.round(finalScore),
    detected_role: sectionResult.detected_role,
    dimension_scores: {
      market_demand: Math.round(dimensionScores.market_demand),
      evidence: Math.round(dimensionScores.evidence),
      skill_depth: Math.round(dimensionScores.skill_depth),
      structure: Math.round(dimensionScores.structure),
      project_strength: Math.round(dimensionScores.project_strength)
    },
    penalties_applied: penaltyResult.breakdown,
    skills_detected: skillDetailedScores,
    section_presence: sectionResult.section_presence,
    improvement_suggestions: suggestions,
    meta: {
      word_count: parseResult.word_count,
      char_count: parseResult.char_count,
      sections_detected: Object.values(sectionResult.section_presence).filter(Boolean).length,
      skills_total: skillsResult.skills_detected.length,
      scored_at: new Date()
    }
  };
}

function generateSuggestions(sectionResult, skillsResult, evidenceResult, structureResult, penaltyResult, depthResult) {
  const suggestions = [];

  // 1. Missing section suggestions
  if (!sectionResult.section_presence.summary) {
    suggestions.push('Add a professional summary at the top to highlight your key qualifications.');
  }
  if (!sectionResult.section_presence.projects) {
    suggestions.push('Include a projects section to demonstrate hands-on experience and tangible outcomes.');
  }

  // 2. Skill evidence suggestions
  if (depthResult.unsubstantiated_ratio > 0.6) {
    suggestions.push(`Many skills (${Math.round(depthResult.unsubstantiated_ratio * 100)}%) lack supporting evidence. Add project context or metrics to substantiate your skills.`);
  }

  // 3. Evidence suggestions
  if (evidenceResult.evidence_score < 50) {
    suggestions.push('Add quantifiable metrics (%, x improvement, $, user counts) to your bullet points to demonstrate impact.');
  }
  if (evidenceResult.metrics_found === 0) {
    suggestions.push('Include measurable achievements (e.g., "Increased conversion by 35%", "Served 10M+ users") rather than general descriptions.');
  }

  // 4. Filler phrase suggestions
  if (penaltyResult.breakdown.filler_ratio > 5) {
    suggestions.push('Replace vague phrases like "responsible for", "worked on", and "involved in" with strong action verbs.');
  }

  // 5. Structure suggestions
  if (structureResult.metrics.bullet_density < 30) {
    suggestions.push('Use bullet points more consistently to improve readability and ATS compatibility.');
  }
  if (structureResult.metrics.word_count < 200) {
    suggestions.push('Expand your resume with more detail about your accomplishments and technical experiences.');
  }

  // 6. Duplicate content suggestion
  if (penaltyResult.breakdown.duplicates > 3) {
    suggestions.push('Remove or consolidate duplicate bullet points for better clarity.');
  }

  // 7. Section-specific suggestions based on role
  if (skillsResult.skills_detected.length === 0) {
    suggestions.push('Add a skills section explicitly listing your technical competencies for better ATS recognition.');
  }

  return suggestions.slice(0, 7); // Max 7 suggestions
}

module.exports = { stage10_output };
