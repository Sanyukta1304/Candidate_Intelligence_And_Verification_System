/**
 * Stage 9: Penalty Deductions
 * Calculates penalties for keyword stuffing, filler ratio, duplicates, wall of text
 */

function stage9_penalties(parseResult, skillsResult, evidenceResult) {
  const text = parseResult.raw_text;
  const wordCount = parseResult.word_count;
  const bulletScores = evidenceResult.bullet_scores;

  let totalPenalty = 0;
  const breakdown = {};

  // 1. Keyword Stuffing Penalty
  // If any skill is mentioned > 8 times, penalize 3 points
  let stuffingPenalty = 0;
  for (const skill of skillsResult.skills_detected) {
    const pattern = new RegExp(`\\b${skill}\\b`, 'gi');
    const mentions = (text.match(pattern) || []).length;
    if (mentions > 8) {
      stuffingPenalty += 3;
    }
  }
  stuffingPenalty = Math.min(10, stuffingPenalty);
  breakdown.keyword_stuffing = stuffingPenalty;
  totalPenalty += stuffingPenalty;

  // 2. Filler Ratio Penalty
  // Count filler phrases; if > 50% of sentences, penalize 8 points
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
  const fillerPenalty = fillerRatio > 0.5 ? 8 : (fillerRatio > 0.3 ? 3 : 0);
  breakdown.filler_ratio = fillerPenalty;
  totalPenalty += fillerPenalty;

  // 3. Duplicate Detection Penalty
  // Find near-duplicate bullets (cosine similarity > 0.85)
  let duplicatePenalty = 0;
  if (bulletScores.length > 1) {
    const bullets = text.split('\n').filter(l => l.trim().match(/^[-•*]/));
    
    for (let i = 0; i < bullets.length; i++) {
      for (let j = i + 1; j < bullets.length; j++) {
        const similarity = calculateSimilarity(bullets[i], bullets[j]);
        if (similarity > 0.85) {
          duplicatePenalty += 3;
        }
      }
    }
  }
  duplicatePenalty = Math.min(15, duplicatePenalty);
  breakdown.duplicates = duplicatePenalty;
  totalPenalty += duplicatePenalty;

  // 4. Wall of Text Penalty
  // If average bullet length > 80 words, penalize 5 pts; > 120 words = 10 pts
  let wallOfTextPenalty = 0;
  if (bulletScores.length > 0) {
    const avgBulletLength = wordCount / Math.max(bulletScores.length, 1);
    if (avgBulletLength > 120) {
      wallOfTextPenalty = 10;
    } else if (avgBulletLength > 80) {
      wallOfTextPenalty = 5;
    }
  }
  breakdown.wall_of_text = wallOfTextPenalty;
  totalPenalty += wallOfTextPenalty;

  return {
    total_penalty: Math.min(30, totalPenalty), // Cap at 30 points
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
