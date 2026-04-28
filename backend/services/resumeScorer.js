/**
 * Resume Scorer - Text-based ATS scoring
 * Scores resume text for completeness, keyword density, and formatting quality
 */

const { createSafeWordBoundaryRegex } = require('../utils/regexEscape');

function scoreResume(resumeText = "") {
  if (!resumeText || typeof resumeText !== "string") {
    return {
      total_ats_score: 0,
      parse_success: true,
      section_scores: {},
      improvements: ["Resume text not provided or invalid format"],
    };
  }

  const text = resumeText.toLowerCase();
  let score = 0;
  const sections = {};

  // 1. Section Completeness (0-25 points)
  const sectionScores = {
    contact: 0,
    summary: 0,
    experience: 0,
    education: 0,
    skills: 0,
  };

  const hasContact =
    text.includes("email") ||
    text.includes("phone") ||
    text.includes("linkedin") ||
    text.includes("github");
  if (hasContact) sectionScores.contact = 5;

  const hasSummary =
    text.includes("summary") ||
    text.includes("objective") ||
    text.includes("profile");
  if (hasSummary) sectionScores.summary = 5;

  const hasExperience =
    text.includes("experience") ||
    text.includes("employment") ||
    text.includes("work");
  if (hasExperience) sectionScores.experience = 5;

  const hasEducation =
    text.includes("education") ||
    text.includes("degree") ||
    text.includes("university");
  if (hasEducation) sectionScores.education = 5;

  const hasSkills =
    text.includes("skills") ||
    text.includes("technical") ||
    text.includes("proficiency");
  if (hasSkills) sectionScores.skills = 5;

  const sectionScore = Object.values(sectionScores).reduce((a, b) => a + b);
  sections.section_completeness = sectionScore;
  score += sectionScore;

  // 2. Keyword Density (0-25 points)
  const technicalKeywords = [
    "python",
    "javascript",
    "java",
    "react",
    "nodejs",
    "sql",
    "mongodb",
    "aws",
    "docker",
    "git",
    "html",
    "css",
    "typescript",
    "angular",
    "vue",
    "express",
    "spring",
    "django",
    "fastapi",
    "kubernetes",
    "jenkins",
    "agile",
    "rest",
    "api",
    "microservices",
    "cloud",
    "devops",
  ];

  let keywordCount = 0;
  technicalKeywords.forEach((keyword) => {
    // ✅ FIXED: Use safe regex that escapes special characters in keywords (C++, C#, Node.js, etc)
    const regex = createSafeWordBoundaryRegex(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) keywordCount += matches.length;
  });

  const keywordScore = Math.min(Math.round((keywordCount / 20) * 25), 25);
  sections.keyword_density = keywordScore;
  score += keywordScore;

  // 3. Format Quality (0-25 points)
  let formatScore = 0;

  // Check for proper structure (line breaks, sections)
  const lines = resumeText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 10) formatScore += 5;

  // Check for bullet points or structured content
  if (resumeText.includes("•") || resumeText.includes("-") || resumeText.includes("*")) {
    formatScore += 5;
  }

  // Check for dates (YYYY format)
  const dateRegex = /\b(19|20)\d{2}\b/g;
  const dates = resumeText.match(dateRegex);
  if (dates && dates.length >= 2) formatScore += 5;

  // Check for proper capitalization
  const capitalized = (resumeText.match(/[A-Z][a-z]+/g) || []).length;
  if (capitalized > 5) formatScore += 5;

  // Check for email/phone format
  if (
    resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ||
    resumeText.match(/\+?1?\d{9,15}/)
  ) {
    formatScore += 5;
  }

  sections.format_quality = formatScore;
  score += formatScore;

  // 4. Length Analysis (0-25 points)
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 0;

  if (wordCount >= 500) lengthScore = 25;
  else if (wordCount >= 400) lengthScore = 20;
  else if (wordCount >= 300) lengthScore = 15;
  else if (wordCount >= 200) lengthScore = 10;
  else if (wordCount >= 100) lengthScore = 5;

  sections.length_analysis = lengthScore;
  score += lengthScore;

  // Generate improvement suggestions
  const improvements = [];

  if (sectionScore < 25) {
    improvements.push(
      "Add missing resume sections: contact, summary, experience, education, skills"
    );
  }
  if (keywordScore < 15) {
    improvements.push(
      "Include more technical keywords relevant to your target roles"
    );
  }
  if (formatScore < 20) {
    improvements.push(
      "Improve formatting: use bullets, dates, clear section headers"
    );
  }
  if (wordCount < 200) {
    improvements.push("Expand resume content - aim for 250+ words minimum");
  }

  return {
    total_ats_score: Math.min(Math.max(score, 0), 100),
    parse_success: true,
    word_count: wordCount,
    section_scores: sectionScores,
    section_completeness: sections.section_completeness,
    keyword_density: sections.keyword_density,
    format_quality: sections.format_quality,
    length_analysis: sections.length_analysis,
    improvement_suggestions: improvements.length > 0 ? improvements : ["Resume looks complete"],
    breakdown: sections,
  };
}

module.exports = {
  scoreResume,
};
