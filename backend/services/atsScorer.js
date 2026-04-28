/**
 * ATS Scorer - Main Orchestrator
 * Calls all 10 scoring stages in sequence to produce comprehensive resume score
 */

const { stage1_parse } = require('./stages/stage1_parse');
const { stage2_sections } = require('./stages/stage2_sections');
const { stage3_skills } = require('./stages/stage3_skills');
const { stage4_demand } = require('./stages/stage4_demand');
const { stage5_usage } = require('./stages/stage5_usage');
const { stage6_evidence } = require('./stages/stage6_evidence');
const { stage7_depth } = require('./stages/stage7_depth');
const { stage8_structure } = require('./stages/stage8_structure');
const { stage9_penalties } = require('./stages/stage9_penalties');
const { stage10_output } = require('./stages/stage10_output');

/**
 * Score a resume file (PDF or DOCX)
 * @param {string} filePath - Absolute path to resume file
 * @returns {Promise<Object>} Complete scoring result
 */
async function scoreResume(filePath) {
  try {
    // Stage 1: Parse & Normalize
    console.log('[ATS Scorer] Stage 1: Parsing resume...');
    const parseResult = await stage1_parse(filePath);
    
    if (!parseResult.parse_success) {
      return {
        final_score: 0,
        parse_error: parseResult.parse_error,
        skills_detected: [],
        improvement_suggestions: ['Failed to parse resume. Please ensure it is a valid PDF or DOCX file.']
      };
    }

    // Stage 2: Section Detection & Role Classification
    console.log('[ATS Scorer] Stage 2: Detecting sections and role...');
    const sectionResult = stage2_sections(parseResult);

    // Stage 3: Skill Extraction
    console.log('[ATS Scorer] Stage 3: Extracting skills...');
    const skillsResult = stage3_skills(parseResult, sectionResult);

    // Stage 4: Market Demand
    console.log('[ATS Scorer] Stage 4: Assigning demand weights...');
    const demandResult = stage4_demand(skillsResult, sectionResult.detected_role);

    // Stage 5: Usage Context
    console.log('[ATS Scorer] Stage 5: Analyzing usage context...');
    const usageResult = stage5_usage(parseResult, sectionResult, skillsResult);

    // Stage 6: Evidence & Impact
    console.log('[ATS Scorer] Stage 6: Scoring evidence and impact...');
    const evidenceResult = stage6_evidence(parseResult, sectionResult);

    // Stage 7: Skill Depth & Coherence
    console.log('[ATS Scorer] Stage 7: Calculating skill depth...');
    const depthResult = stage7_depth(skillsResult, evidenceResult);

    // Stage 8: Structure & ATS Compatibility
    console.log('[ATS Scorer] Stage 8: Scoring structure...');
    const structureResult = stage8_structure(parseResult, sectionResult);

    // Stage 9: Penalty Deductions
    console.log('[ATS Scorer] Stage 9: Calculating penalties...');
    const penaltyResult = stage9_penalties(parseResult, skillsResult, evidenceResult);

    // Stage 10: Final Score & Suggestions
    console.log('[ATS Scorer] Stage 10: Computing final score...');
    const finalResult = stage10_output(
      parseResult,
      sectionResult,
      skillsResult,
      demandResult,
      usageResult,
      evidenceResult,
      depthResult,
      structureResult,
      penaltyResult
    );

    console.log(`[ATS Scorer] Complete! Final Score: ${finalResult.final_score}/100`);

    // ✅ Stage 10 now returns KPI component scores using the simplified medium-level ATS formula
    // Use them directly instead of recalculating
    return {
      ...finalResult,
      // ✅ KPI component scores already calculated by Stage 10
      // section_score, keyword_score, format_score, skill_score, project_strength included in finalResult
    };
  } catch (error) {
    console.error('[ATS Scorer] Error:', error.message);
    return {
      final_score: 0,
      parse_error: `Scoring error: ${error.message}`,
      skills_detected: [],
      improvement_suggestions: ['An error occurred while scoring your resume. Please try again.']
    };
  }
}

module.exports = { scoreResume };
