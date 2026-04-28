/**
 * Resume Skills Extractor
 * Extracts skills from full resume content using semantic-based detection
 * Looks for skills in: summary, experience, internship, certifications, technical profile, etc.
 */

const { createSafeWordBoundaryRegex } = require('../utils/regexEscape');

const commonSkills = [
  // Programming Languages
  'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'kotlin',
  'swift', 'typescript', 'scala', 'perl', 'bash', 'shell', 'r', 'matlab', 'groovy',
  
  // Web Frameworks
  'react', 'angular', 'vue', 'express', 'django', 'flask', 'spring', 'laravel',
  'rails', 'asp.net', 'fastapi', 'nestjs', 'nextjs', 'gatsby', 'svelte',
  
  // Databases
  'mongodb', 'postgresql', 'mysql', 'redis', 'cassandra', 'dynamodb', 'elasticsearch',
  'firebase', 'oracle', 'sql', 'sqlite', 'graphql', 'sqlserver', 'mariadb',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'docker', 'kubernetes', 'jenkins',
  'git', 'github', 'gitlab', 'bitbucket', 'terraform', 'ansible', 'cloudformation',
  'circleci', 'travis', 'gitlab ci', 'github actions', 'nginx', 'apache',
  
  // Data & ML
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'spark',
  'hadoop', 'tableau', 'powerbi', 'excel', 'jupyter', 'matplotlib', 'seaborn',
  'nlp', 'cv', 'machine learning', 'deep learning', 'neural networks',
  
  // Mobile
  'react native', 'flutter', 'kotlin', 'swift', 'ios', 'android', 'xamarin',
  
  // Testing & QA
  'jest', 'mocha', 'pytest', 'junit', 'selenium', 'cypress', 'postman', 'rest assured',
  
  // Tools & Methodologies
  'agile', 'scrum', 'jira', 'confluence', 'slack', 'jinja', 'html', 'css',
  'xml', 'json', 'rest', 'soap', 'api', 'microservices', 'monolith',
  'design patterns', 'solid', 'oops', 'functional programming'
];

/**
 * Extract skills from resume content
 * Returns array of skills found in the resume
 */
function extractSkillsFromResume(resumeText = "") {
  if (!resumeText || typeof resumeText !== 'string') {
    return [];
  }

  const lowerResumeText = resumeText.toLowerCase();
  const extractedSkills = [];
  
  // Find all skill mentions (case-insensitive)
  for (const skill of commonSkills) {
    // Use word boundary to avoid partial matches
    // e.g., "python" should not match "pythonic"
    // ✅ FIXED: Use safe regex that escapes special characters in skill names (C++, C#, Node.js, etc)
    const skillRegex = createSafeWordBoundaryRegex(skill, 'gi');
    
    if (skillRegex.test(lowerResumeText)) {
      // Check context to ensure it's meaningful (not just in a URL or random text)
      const context = extractContextAroundSkill(lowerResumeText, skill);
      
      if (context && isSkillContextRelevant(context)) {
        extractedSkills.push(skill.toLowerCase().trim());
      }
    }
  }

  // Remove duplicates and return
  return [...new Set(extractedSkills)];
}

/**
 * Extract context around where skill appears in resume
 */
function extractContextAroundSkill(text, skill) {
  const regex = new RegExp(`([^.]*?${skill}[^.]*\\.)`, 'gi');
  const matches = text.match(regex);
  return matches ? matches[0] : null;
}

/**
 * Check if the context around skill mentions is relevant
 * Avoid matches in URLs, headers without context, etc.
 */
function isSkillContextRelevant(context) {
  if (!context) return false;
  
  // Skip if it's just a URL or link
  if (context.includes('http') || context.includes('www.')) {
    return false;
  }
  
  // Skip if context is too short (likely not meaningful)
  if (context.trim().length < 10) {
    return false;
  }
  
  // Check for relevant context keywords
  const relevantKeywords = [
    'used', 'developed', 'built', 'created', 'implemented', 'designed',
    'worked', 'experience', 'proficient', 'expert', 'skilled', 'knowledge',
    'familiar', 'experienced', 'competent', 'trained', 'utilized', 'employed',
    'responsible', 'managed', 'led', 'architected', 'engineered',
    'technical', 'tech stack', 'stack', 'tools', 'languages', 'frameworks'
  ];
  
  const lowerContext = context.toLowerCase();
  return relevantKeywords.some(keyword => lowerContext.includes(keyword));
}

/**
 * Score resume declaration for a specific skill
 * Returns score 0-100 based on how the skill is declared in resume
 */
function scoreResumeDeclaration(skillName, resumeText = "") {
  if (!resumeText || !skillName) {
    return 0;
  }

  const lowerResumeText = resumeText.toLowerCase();
  const lowerSkill = skillName.toLowerCase();

  // Check if skill exists in resume at all
  // ✅ FIXED: Use safe regex that escapes special characters in skill names (C++, C#, Node.js, etc)
  const skillRegex = createSafeWordBoundaryRegex(lowerSkill, 'gi');
  if (!skillRegex.test(lowerResumeText)) {
    return 0; // Skill not found in resume
  }

  // Count how many times the skill appears
  const matches = (lowerResumeText.match(skillRegex) || []).length;

  // Check context of skill mention
  const contextScore = extractContextAroundSkill(lowerResumeText, lowerSkill);
  const isContextRelevant = isSkillContextRelevant(contextScore);

  // Scoring logic:
  // - Not found: 0
  // - Found once with relevant context: 50
  // - Found 2+ times with relevant context: 80
  // - Found in multiple sections: 100

  if (!isContextRelevant && matches === 1) {
    return 30; // Found but weak context
  }

  if (isContextRelevant && matches === 1) {
    return 60; // Found once with good context
  }

  if (isContextRelevant && matches >= 2) {
    return 90; // Found multiple times with good context
  }

  // Check if skill appears in multiple resume sections (experience, projects, etc)
  const sectionMatches = countSkillInSections(lowerResumeText, lowerSkill);
  if (sectionMatches >= 2) {
    return 100; // Skill mentioned in multiple sections
  }

  return 70; // Default for multiple mentions
}

/**
 * Count how many different resume sections mention the skill
 */
function countSkillInSections(resumeText, skill) {
  // Define common resume sections
  const sections = {
    experience: /(?:work\s+experience|professional\s+experience|employment)[^]*?(?:education|skills|certif|$)/gi,
    projects: /(?:project|side\s+project)[^]*?(?:education|skills|certif|$)/gi,
    education: /(?:education|degree|university|college)[^]*?(?:skills|certif|$)/gi,
    certifications: /(?:certif|certification|certified)[^]*?(?:skills|$)/gi,
    skills: /(?:technical\s+skill|skill|competenc)[^]*?(?:project|experience|$)/gi
  };

  let sectionCount = 0;

  for (const [sectionName, regex] of Object.entries(sections)) {
    const sectionMatch = resumeText.match(regex);
    if (sectionMatch) {
      const sectionText = sectionMatch[0].toLowerCase();
      if (sectionText.includes(skill)) {
        sectionCount++;
      }
    }
  }

  return sectionCount;
}

module.exports = {
  extractSkillsFromResume,
  scoreResumeDeclaration,
  commonSkills
};
