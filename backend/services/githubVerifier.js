const axios = require("axios");

// Extract owner + repo from GitHub URL
function parseGitHubUrl(url) {
  const cleaned = url
    .replace("https://github.com/", "")
    .replace("http://github.com/", "")
    .trim();

  const parts = cleaned.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Invalid GitHub URL");
  }

  return {
    owner: parts[0],
    repo: parts[1].replace(".git", ""),
  };
}

// GitHub API instance
function githubApi(token) {
  return axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
}

// MAIN FUNCTION
async function verifyRepo(project, candidate) {
  try {
    if (!candidate.github_access_token || !candidate.github_username) {
      throw new Error("GitHub not connected");
    }

    const { owner, repo } = parseGitHubUrl(project.github_link);

    const api = githubApi(candidate.github_access_token);

    const [repoRes, userCommitsRes, readmeRes, allCommitsRes] =
      await Promise.allSettled([
        api.get(`/repos/${owner}/${repo}`),
        api.get(`/repos/${owner}/${repo}/commits?author=${candidate.github_username}&per_page=100`),
        api.get(`/repos/${owner}/${repo}/readme`),
        api.get(`/repos/${owner}/${repo}/commits?per_page=100`),
      ]);

    if (repoRes.status !== "fulfilled") {
      throw new Error("Repo not found");
    }

    const repoData = repoRes.value.data;

    const hasReadme = readmeRes.status === "fulfilled";

    const userCommits =
      userCommitsRes.status === "fulfilled" ? userCommitsRes.value.data.length : 0;

    const totalCommits =
      allCommitsRes.status === "fulfilled" ? allCommitsRes.value.data.length : 0;

    const ratio = totalCommits > 0 ? userCommits / totalCommits : 0;

    // ✅ CHECK IF USER IS THE REPO OWNER (by comparing username)
    const isOwner = owner.toLowerCase() === candidate.github_username.toLowerCase();

    // UPDATE PROJECT DIRECTLY
    project.github_owner = owner;
    project.github_repo = repo;

    project.is_public = !repoData.private;
    project.has_readme = hasReadme;
    project.repo_description = repoData.description;
    project.repo_language = repoData.language;

    project.total_commits = totalCommits;
    project.user_commits = userCommits;
    project.user_commit_ratio = ratio;

    project.last_pushed_at = repoData.pushed_at;
    project.user_is_owner = isOwner;
    project.user_is_contributor = userCommits > 0;

    return project;
  } catch (err) {
    console.error("GitHub verify error:", err.message);
    throw err;
  }
}

module.exports = {
  verifyRepo,
};