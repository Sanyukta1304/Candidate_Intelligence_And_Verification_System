/**
 * Stage 2: Section Detection & Role Classification
 * Detects resume sections using heading/density heuristics
 * Classifies role based on skill signatures
 */

const sectionHeadings = require('../data/sectionHeadings');

function stage2_sections(parseResult) {
  const text = parseResult.raw_text.toLowerCase();
  const lines = text.split('\n');

  // Map for detected sections
  const sections = {
    SUMMARY: null,
    EXPERIENCE: null,
    EDUCATION: null,
    SKILLS: null,
    PROJECTS: null,
    CERTIFICATIONS: null,
    AWARDS: null,
    LANGUAGES: null
  };

  const sectionTexts = {};
  let currentSection = null;
  let currentContent = [];

  // Two-pass detection
  // Pass 1: Find section headings
  const sectionLineIndices = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line is a section heading
    for (const [sectionName, headings] of Object.entries(sectionHeadings)) {
      if (headings.some(h => line === h || line.startsWith(h.toUpperCase()))) {
        sectionLineIndices[sectionName] = i;
        break;
      }
    }
  }

  // Pass 2: Extract content for each section
  const sortedSections = Object.entries(sectionLineIndices)
    .sort((a, b) => a[1] - b[1]);

  for (let i = 0; i < sortedSections.length; i++) {
    const [sectionName, startIdx] = sortedSections[i];
    const endIdx = i + 1 < sortedSections.length ? sortedSections[i + 1][1] : lines.length;
    
    const sectionContent = lines
      .slice(startIdx + 1, endIdx)
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .join('\n');

    sectionTexts[sectionName] = sectionContent;
  }

  // Check which sections were detected
  for (const [section, content] of Object.entries(sectionTexts)) {
    if (content && content.length > 0) {
      sections[section] = content;
    }
  }

  // Role classification based on skill signatures
  const roleScores = {
    Frontend: 0,
    Backend: 0,
    FullStack: 0,
    Data: 0,
    DevOps: 0,
    Mobile: 0
  };

  const allText = text;

  // Frontend indicators
  const frontendSkills = ['react', 'angular', 'vue', 'html', 'css', 'tailwind', 'next.js', 'typescript', 'javascript'];
  const frontendCount = frontendSkills.filter(s => allText.includes(s)).length;
  roleScores.Frontend += frontendCount * 2;

  // Backend indicators
  const backendSkills = ['node.js', 'django', 'spring', 'fastapi', 'flask', 'express', 'java', 'python'];
  const backendCount = backendSkills.filter(s => allText.includes(s)).length;
  roleScores.Backend += backendCount * 2;

  // FullStack indicators (both front and back)
  if (frontendCount > 0 && backendCount > 0) {
    roleScores.FullStack += Math.min(frontendCount, backendCount) * 3;
  }

  // Data indicators
  const dataSkills = ['python', 'sql', 'spark', 'pandas', 'tensorflow', 'pytorch', 'scikit', 'machine learning', 'data analysis'];
  const dataCount = dataSkills.filter(s => allText.includes(s)).length;
  roleScores.Data += dataCount * 2;

  // DevOps indicators
  const devopsSkills = ['kubernetes', 'docker', 'terraform', 'jenkins', 'ci/cd', 'aws', 'gcp', 'azure', 'linux'];
  const devopsCount = devopsSkills.filter(s => allText.includes(s)).length;
  roleScores.DevOps += devopsCount * 2;

  // Mobile indicators
  const mobileSkills = ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'expo'];
  const mobileCount = mobileSkills.filter(s => allText.includes(s)).length;
  roleScores.Mobile += mobileCount * 2;

  // Detect role
  let detectedRole = 'Unknown';
  let maxScore = 0;
  for (const [role, score] of Object.entries(roleScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedRole = role;
    }
  }

  return {
    sections,
    detected_role: detectedRole === 'Unknown' ? 'Unknown' : detectedRole,
    role_scores: roleScores,
    section_presence: {
      summary: !!sections.SUMMARY,
      experience: !!sections.EXPERIENCE,
      education: !!sections.EDUCATION,
      skills: !!sections.SKILLS,
      projects: !!sections.PROJECTS,
      certifications: !!sections.CERTIFICATIONS
    }
  };
}

module.exports = { stage2_sections };
