const { scoreResumeDeclaration } = require('./resumeSkillsExtractor');

function scoreSkills(skills = [], resumeText = "", verifiedProjects = [], extractedSkills = []) {
  const lowerResumeText = (resumeText || "").toLowerCase();
  const lowerExtractedSkills = (extractedSkills || []).map(s => s.toLowerCase());

  const scoredSkills = skills.map((skillObj) => {
    const skillName = (skillObj.name || "").toLowerCase().trim();

    // ✅ VALIDATION: Check if skill exists in extracted skills from resume
    const skillFoundInResume = lowerExtractedSkills.includes(skillName);

    if (!skillFoundInResume) {
      // Skill not found in uploaded resume - score as 0
      return {
        ...skillObj.toObject?.() ?? skillObj,
        project_score: 0,
        resume_score: 0,
        decl_score: 0,
        sub_score: 0,
        validation_status: "Skill not found in uploaded resume"
      };
    }

    // Count how many verified projects use this skill
    const matchingProjects = verifiedProjects.filter((project) => {
      const techStack = (project.tech_stack || []).map((tech) =>
        tech.toLowerCase().trim()
      );

      const repoLanguage = (project.repo_language || "").toLowerCase().trim();

      return techStack.includes(skillName) || repoLanguage === skillName;
    });

    // project_usage score out of 100
    let projectUsageScore = 0;
    if (matchingProjects.length >= 2) {
      projectUsageScore = 100;
    } else if (matchingProjects.length === 1) {
      projectUsageScore = 70;
    }

    // ✅ FIXED: Resume declaration score using semantic extraction
    // Using the new resumeSkillsExtractor function for proper context-based detection
    const resumeDeclarationScore = scoreResumeDeclaration(skillName, resumeText);

    // declaration score out of 100
    const declarationScore = 100;

    // Final sub score using proper weighting
    // Skill Score = (Project Usage × 0.5) + (Resume Declaration × 0.3) + (Skill Declaration × 0.2)
    const subScore =
      projectUsageScore * 0.5 +
      resumeDeclarationScore * 0.3 +
      declarationScore * 0.2;

    return {
      ...skillObj.toObject?.() ?? skillObj,
      project_score: projectUsageScore,
      resume_score: resumeDeclarationScore,
      decl_score: declarationScore,
      sub_score: Math.round(subScore),
      validation_status: "Valid - Found in resume"
    };
  });

  const averageSubScore =
    scoredSkills.length > 0
      ? scoredSkills.reduce((sum, skill) => sum + skill.sub_score, 0) /
        scoredSkills.length
      : 0;

  // Normalize overall skills score to 0–40
  const skillsScore = Math.round((averageSubScore / 100) * 40);

  return {
    scoredSkills,
    skills_score: skillsScore,
  };
}

module.exports = {
  scoreSkills,
};