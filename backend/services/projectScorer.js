function getRecencyScore(lastPushedAt) {
  if (!lastPushedAt) return 0;

  const pushedDate = new Date(lastPushedAt);
  const now = new Date();

  const diffMonths =
    (now.getFullYear() - pushedDate.getFullYear()) * 12 +
    (now.getMonth() - pushedDate.getMonth());

  if (diffMonths <= 6) return 10;
  if (diffMonths <= 12) return 5;
  return 0;
}

function getVolumeScore(userCommits) {
  if (userCommits >= 50) return 20;
  if (userCommits >= 21) return 15;
  if (userCommits >= 6) return 10;
  if (userCommits >= 1) return 5;
  return 0;
}

function getRatioScore(userCommitRatio) {
  if (!userCommitRatio || userCommitRatio <= 0) return 0;
  return Math.round(Math.min(userCommitRatio / 0.5, 1) * 15);
}

function getMetaScore(repoLanguage, techStack = [], repoDescription = "") {
  let score = 0;

  if (repoDescription && repoDescription.trim().length > 0) {
    score += 5;
  }

  const normalizedTech = techStack.map((t) => t.toLowerCase());

  if (
    repoLanguage &&
    normalizedTech.includes(repoLanguage.toLowerCase())
  ) {
    score += 5;
  }

  return score;
}

function scoreProject(project) {
  const public_score = project.is_public ? 10 : 0;
  const readme_score = project.has_readme ? 10 : 0;
  const user_commit_score = project.user_commits > 0 ? 25 : 0;

  const ratio_score = getRatioScore(project.user_commit_ratio);
  const volume_score = getVolumeScore(project.user_commits);
  const recency_score = getRecencyScore(project.last_pushed_at);

  const meta_score = getMetaScore(
    project.repo_language,
    project.tech_stack,
    project.repo_description
  );

  const total =
    public_score +
    readme_score +
    user_commit_score +
    ratio_score +
    volume_score +
    recency_score +
    meta_score;

  // ✅ VERIFICATION STRATEGY:
  // Project is verified if:
  // 1. User is the OWNER and has at least 1+ commits
  // 2. OR User is a CONTRIBUTOR with at least 1 commit
  const isVerified = 
    (project.user_is_owner && project.user_commits >= 1) ||
    (project.user_is_contributor && project.user_commits >= 1);

  return {
    verified: isVerified,
    project_score: total,
    score_breakdown: {
      public_score,
      readme_score,
      user_commit_score,
      ratio_score,
      volume_score,
      recency_score,
      meta_score,
    },
  };
}

module.exports = {
  scoreProject,
};