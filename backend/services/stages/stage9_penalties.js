/**
 * Stage 9: Penalty Deductions
 * Calculates penalties for keyword stuffing, filler ratio, duplicates, wall of text
 */

const { createSafeWordBoundaryRegex } = require('../../utils/regexEscape');

function stage9_penalties(parseResult, skillsResult, evidenceResult) {
  const text = parseResult.raw_text;
  const wordCount = parseResult.word_count;
  const bulletScores = evidenceResult.bullet_scores;

  let totalPenalty = 0;
  const breakdown = {};

  // 1. Keyword Stuffing Penalty (REDUCED: max 3 points instead of 10)
  // Medium-level ATS: lighter penalty - only penalize excessive mentions > 15 times
  let stuffingPenalty = 0;
  for (const skill of skillsResult.skills_detected) {
    // ✅ FIXED: Use safe regex that escapes special characters (C++, C#, Node.js, etc.)
    const pattern = createSafeWordBoundaryRegex(skill, 'gi');
    const mentions = (text.match(pattern) || []).length;
    if (mentions > 15) {
      stuffingPenalty += 1; // Only 1 point per excessive skill
    }
  }
  stuffingPenalty = Math.min(3, stuffingPenalty); // Max 3 points
  breakdown.keyword_stuffing = stuffingPenalty;
  totalPenalty += stuffingPenalty;

  // 2. Filler Ratio Penalty (REDUCED: max 2 points instead of 8)
  // Medium-level ATS: only penalize if > 70% filler (excessively high)
  const fillerPhrases = [
    'responsible for', 'worked on', 'involved in', 'assisted with',
    'participated in', 'familiar with', 'experience with', 'worked with'
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let fillerSentences = 0;
  for (const sentence of sentences) {
    if (fillerPhrases.some(fp => sentence.toLowerCase().includes(fp))) {
      fillerSentences++;
    }
  }
  
  const fillerRatio = sentences.length > 0 ? fillerSentences / sentences.length : 0;
  const fillerPenalty = fillerRatio > 0.7 ? 2 : 0; // Only penalize if > 70%
  breakdown.filler_ratio = fillerPenalty;
  totalPenalty += fillerPenalty;

  // 3. Duplicate Detection Penalty (REDUCED: max 2 points instead of 15)
  // Medium-level ATS: only penalize obvious duplicates (similarity > 0.95)
  let duplicatePenalty = 0;
  if (bulletScores.length > 1) {
    const bullets = text.split('\n').filter(l => l.trim().match(/^[-•*]/));
    let duplicateCount = 0;
    
    for (let i = 0; i < bullets.length; i++) {
      for (let j = i + 1; j < bullets.length; j++) {
        const similarity = calculateSimilarity(bullets[i], bullets[j]);
        if (similarity > 0.95) { // Only very high similarity (was 0.85)
          duplicateCount++;
        }
      }
    }
    duplicatePenalty = duplicateCount > 0 ? 2 : 0; // Max 2 points
  }
  breakdown.duplicates = duplicatePenalty;
  totalPenalty += duplicatePenalty;

  // 4. Wall of Text Penalty (REDUCED: max 1 point instead of 10)
  // Medium-level ATS: only penalize extremely verbose bullets (avg > 150 words per bullet)
  let wallOfTextPenalty = 0;
  if (bulletScores.length > 0) {
    const avgBulletLength = wordCount / Math.max(bulletScores.length, 1);
    if (avgBulletLength > 150) { // Only if extremely verbose (was 80+)
      wallOfTextPenalty = 1;
    }
  }
  breakdown.wall_of_text = wallOfTextPenalty;
  totalPenalty += wallOfTextPenalty;

  return {
    total_penalty: Math.min(8, totalPenalty), // REDUCED: Cap at 8 points (was 30) for medium-level ATS
    breakdown,
    ratios: {
      filler_ratio: fillerRatio,
      avg_bullet_length: wordCount / Math.max(bulletScores.length, 1)
    }
  };
}

// Helper: Simple string similarity (Jaccard index based)
function calculateSimilarity(str1, str2) {
  const tokens1 = new Set(str1.toLowerCase().split(/\s+/));
  const tokens2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

module.exports = { stage9_penalties };
