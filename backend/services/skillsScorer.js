function scoreSkills(skills = [], resumeText = "", verifiedProjects = []) {
  const lowerResumeText = (resumeText || "").toLowerCase();

  const scoredSkills = skills.map((skillObj) => {
    const skillName = (skillObj.name || "").toLowerCase().trim();

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

    // resume_mention score out of 100
    const resumeMentionScore = lowerResumeText.includes(skillName) ? 100 : 0;

    // declaration score out of 100
    const declarationScore = 100;

    // Final sub score
    const subScore =
      projectUsageScore * 0.5 +
      resumeMentionScore * 0.3 +
      declarationScore * 0.2;

    return {
      ...skillObj.toObject?.() ?? skillObj,
      project_score: projectUsageScore,
      resume_score: resumeMentionScore,
      decl_score: declarationScore,
      sub_score: Math.round(subScore),
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