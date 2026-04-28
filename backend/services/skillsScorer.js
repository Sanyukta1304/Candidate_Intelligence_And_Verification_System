const { scoreResumeDeclaration } = require('./resumeSkillsExtractor');

function scoreSkills(skills = [], resumeText = "", verifiedProjects = [], extractedSkills = []) {
  const lowerResumeText = (resumeText || "").toLowerCase();
  const lowerExtractedSkills = (extractedSkills || []).map(s => s.toLowerCase());

  const scoredSkills = skills.map((skillObj) => {
    const skillName = (skillObj.name || "").toLowerCase().trim();

    // ✅ FIXED: Changed logic to apply formula even if skill not in resume
    // Formula applies: (Project Usage × 0.5) + (Resume Mention × 0.3) + (Skill Declaration × 0.2)
    // Even if resume mention is 0, project usage + skill declaration still contribute

    // 1. SKILL DECLARATION (20%) - Candidate explicitly listed this skill
    // This is always 100 since they added it to their profile
    const declarationScore = 100;

    // 2. PROJECT USAGE (50%) - Count verified projects using this skill
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

    // 3. RESUME MENTION (30%) - Check if skill is mentioned in resume content
    // ✅ FIXED: Use semantic extraction, not just presence check
    // Even if skill isn't in extractedSkills, scoreResumeDeclaration can still find it
    const resumeDeclarationScore = scoreResumeDeclaration(skillName, resumeText);

    // ✅ Final Skill Score using formula: 50% project + 30% resume + 20% declaration
    const subScore =
      projectUsageScore * 0.5 +
      resumeDeclarationScore * 0.3 +
      declarationScore * 0.2;

    // ✅ FIXED: No validation blocking - always calculate score
    return {
      ...skillObj.toObject?.() ?? skillObj,
      project_score: projectUsageScore,
      resume_score: resumeDeclarationScore,
      decl_score: declarationScore,
      sub_score: Math.round(subScore),
      validation_status: "Valid - Scored using full formula"
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