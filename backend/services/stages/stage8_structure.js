/**
 * Stage 8: Structure & ATS Compatibility
 * Scores resume structure: sections, bullets, length, dates, encoding
 */

function stage8_structure(parseResult, sectionResult) {
  const sections = sectionResult.section_presence;
  const text = parseResult.raw_text;
  const wordCount = parseResult.word_count;

  let structureScore = 0;

  // 1. Section completeness (30 points max)
  let sectionPoints = 0;
  const requiredSections = ['summary', 'experience', 'education', 'skills'];
  const presentRequired = requiredSections.filter(s => sections[s]).length;
  sectionPoints = (presentRequired / requiredSections.length) * 30;
  structureScore += sectionPoints;

  // 2. Bullet point structure (25 points max)
  const lines = text.split('\n');
  const bulletLines = lines.filter(l => l.trim().match(/^[-•*]|\s{2,}[-•*]/));
  const bulletDensity = bulletLines.length / lines.length;
  
  let bulletPoints = 0;
  if (bulletDensity > 0.5) {
    bulletPoints = 25;
  } else if (bulletDensity > 0.3) {
    bulletPoints = 20;
  } else if (bulletDensity > 0.1) {
    bulletPoints = 10;
  }
  structureScore += bulletPoints;

  // 3. Length appropriateness (20 points max)
  let lengthPoints = 0;
  if (wordCount >= 200 && wordCount <= 1000) {
    lengthPoints = 20;
  } else if (wordCount >= 150 && wordCount <= 1200) {
    lengthPoints = 15;
  } else if (wordCount >= 100) {
    lengthPoints = 10;
  }
  structureScore += lengthPoints;

  // 4. Date presence (15 points max)
  const datePattern = /\b(?:19|20)\d{2}\b|\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi;
  const dateMatches = text.match(datePattern) || [];
  const datePoints = Math.min(15, (dateMatches.length / 5) * 15);
  structureScore += datePoints;

  // 5. Encoding/Format (10 points max)
  // Check for parsing success and special characters
  const encodingPoints = parseResult.parse_success ? 10 : 5;
  structureScore += encodingPoints;

  // Final structure score (0-100 scale)
  structureScore = Math.min(100, structureScore);

  return {
    structure_score: Math.round(structureScore),
    breakdown: {
      section_completeness: Math.round(sectionPoints),
      bullet_structure: Math.round(bulletPoints),
      length_appropriateness: Math.round(lengthPoints),
      date_presence: Math.round(datePoints),
      encoding_format: Math.round(encodingPoints)
    },
    metrics: {
      word_count: wordCount,
      line_count: lines.length,
      bullet_density: Math.round(bulletDensity * 100),
      date_count: dateMatches.length
    }
  };
}

module.exports = { stage8_structure };
