/**
 * Stage 10: Final Score Computation & Improvement Suggestions
 * SIMPLIFIED: Medium-level practical ATS formula (not enterprise-level)
 * 
 * Formula: ATS Score = (Section×30%) + (Keyword×25%) + (Format×20%) + (Skill×15%) + (Project×10%)
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
      section_presence: {},
      skills_detected: [],
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

  // ✅ SIMPLIFIED: Medium-level ATS scoring (not enterprise-level)
  // Calculate KPI component scores from actual resume analysis

  // 1. Section Score (0-100): Based on sections present
  // ✅ FIXED: Count actual detected sections from sectionResult.section_presence (after LANGUAGES→SKILLS remapping)
  const sectionsPresent = Object.values(sectionResult.section_presence || {}).filter(Boolean).length;
  const totalImportantSections = 6; // summary, experience, education, skills, projects, certifications
  const section_score = Math.round((sectionsPresent / totalImportantSections) * 100);
  
  console.log(`[Stage 10] ✅ Section Detection: ${sectionsPresent}/${totalImportantSections} sections found`);

  // 2. Keyword Score (0-100): Based on skill relevance and technical keywords
  // Use structure score as proxy for keyword/technical match
  const keyword_score = Math.round(structureResult.structure_score || 50);

  // 3. Format Score (0-100): Based on structure and ATS compatibility
  const format_score = structureResult.structure_score || 60;

  // 4. Skill Score (0-100): Average of extracted skills quality
  let skill_score = 50; // baseline
  if (skillsResult.skills_detected && skillsResult.skills_detected.length > 0) {
    // Skill score based on number of skills and their depth
    const skillCount = skillsResult.skills_detected.length;
    skill_score = Math.min(100, 40 + (skillCount * 5)); // 40-100 scale
  }

  // 5. Project Strength (0-100): Evidence in projects section  
  let project_strength = 40; // baseline
  if (sectionResult.section_presence.projects) {
    // If projects section exists, boost score
    project_strength = Math.min(100, 60 + (skillsResult.skills_detected.length * 2));
  }

  // ✅ NEW SIMPLIFIED FORMULA: (Section×30%) + (Keyword×25%) + (Format×20%) + (Skill×15%) + (Project×10%)
  let finalScore = (
    (section_score * 0.30) +
    (keyword_score * 0.25) +
    (format_score * 0.20) +
    (skill_score * 0.15) +
    (project_strength * 0.10)
  );

  // ✅ REDUCED: Apply only light penalties (max 8 points, not 30)
  finalScore -= Math.min(penaltyResult.total_penalty || 0, 8);
  finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp to [0, 100]

  console.log(`[Stage 10] ════════════════════════════════════════`);
  console.log(`[Stage 10] FINAL ATS SCORE CALCULATION`);
  console.log(`[Stage 10] ════════════════════════════════════════`);
  console.log(`[Stage 10] ✅ Section Presence (after remapping):`, sectionResult.section_presence);
  console.log(`[Stage 10] Section Score: ${section_score}`);
  console.log(`[Stage 10] Keyword Score: ${keyword_score}`);
  console.log(`[Stage 10] Format Score: ${format_score}`);
  console.log(`[Stage 10] Skill Score: ${skill_score}`);
  console.log(`[Stage 10] Project Strength: ${project_strength}`);
  console.log(`[Stage 10] Penalties: ${penaltyResult.total_penalty || 0}`);
  console.log(`[Stage 10] Final ATS Score: ${Math.round(finalScore)}/100`);

  // Generate improvement suggestions
  const suggestions = generateSuggestions(
    sectionResult,
    skillsResult,
    section_score,
    keyword_score,
    format_score,
    penaltyResult
  );

  return {
    final_score: Math.round(finalScore),
    detected_role: sectionResult.detected_role || 'Unknown',
    // ✅ Return KPI component scores for frontend
    section_score: Math.round(section_score),
    keyword_score: Math.round(keyword_score),
    format_score: Math.round(format_score),
    skill_score: Math.round(skill_score),
    project_strength: Math.round(project_strength),
    section_presence: sectionResult.section_presence,
    skills_detected: (skillsResult.skills_detected || []).map(skill => ({
      canonical: skill,
      sections_present: Object.keys(skillsResult.skill_section_matrix ? (skillsResult.skill_section_matrix[skill] || {}) : {})
    })),
    improvement_suggestions: suggestions,
    meta: {
      word_count: parseResult.word_count,
      char_count: parseResult.char_count,
      sections_detected: Object.values(sectionResult.section_presence).filter(Boolean).length,
      skills_total: skillsResult.skills_detected ? skillsResult.skills_detected.length : 0,
      scored_at: new Date()
    }
  };
}

function generateSuggestions(sectionResult, skillsResult, section_score, keyword_score, format_score, penaltyResult) {
  const suggestions = [];

  // 1. Missing section suggestions
  if (!sectionResult.section_presence.summary) {
    suggestions.push('Add a professional summary at the top to highlight your key qualifications.');
  }
  if (!sectionResult.section_presence.projects) {
    suggestions.push('Include a projects section to demonstrate hands-on experience and tangible outcomes.');
  }
  if (!sectionResult.section_presence.education && !sectionResult.section_presence.certifications) {
    suggestions.push('Add your education or certifications section to establish credibility.');
  }

  // 2. Skill section suggestions
  if (!sectionResult.section_presence.skills) {
    suggestions.push('Add a dedicated skills section listing your technical competencies for better ATS recognition.');
  }
  if (skillsResult.skills_detected && skillsResult.skills_detected.length < 5) {
    suggestions.push('Include more technical skills in your resume to increase match potential with job descriptions.');
  }

  // 3. Format suggestions
  if (format_score < 60) {
    suggestions.push('Improve formatting: use consistent bullet points, dates, and section headers for better ATS compatibility.');
  }

  // 4. Keyword suggestions
  if (keyword_score < 60) {
    suggestions.push('Include more industry-specific keywords and technical terminology relevant to your target role.');
  }

  // 5. Penalty suggestions
  if (penaltyResult.breakdown.filler_ratio > 1) {
    suggestions.push('Replace generic phrases like "responsible for" and "worked on" with strong action verbs.');
  }
  if (penaltyResult.breakdown.wall_of_text > 0) {
    suggestions.push('Break up long bullet points into shorter, more impactful statements.');
  }

  return suggestions.slice(0, 6); // Max 6 suggestions
}

module.exports = { stage10_output };
