const USERNAME = "SirBepy";
const CACHE_KEY = "portfolio_projects_cache";

const API_BASE = "https://api.github.com";
const RAW_BASE = "https://raw.githubusercontent.com";

/**
 * Fetch a text file from a public repo via raw.githubusercontent.com.
 * Returns null if the file doesn't exist (404).
 */
async function fetchRawFile(owner, repo, branch, filePath) {
  const url = `${RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.text();
}

/**
 * Build the raw URL for an image in .portfolio-data/.
 * No download needed, the browser fetches it directly.
 */
function rawImageUrl(owner, repo, branch, imageName) {
  return `${RAW_BASE}/${owner}/${repo}/${branch}/.portfolio-data/${imageName}`;
}

/**
 * Fetch all public repos for the user, handling pagination.
 */
async function fetchPublicRepos() {
  const repos = [];
  let page = 1;

  while (true) {
    const url = `${API_BASE}/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const batch = await res.json();
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }

  return repos;
}

/**
 * Process a single repo: fetch metadata.json and PORTFOLIO.md.
 * Returns a project object or null if the repo has no .portfolio-data/.
 */
async function processRepo(repo) {
  const owner = repo.owner.login;
  const name = repo.name;
  const branch = repo.default_branch;

  const metadataRaw = await fetchRawFile(owner, name, branch, ".portfolio-data/metadata.json");
  if (!metadataRaw) return null;

  let metadata;
  try {
    metadata = JSON.parse(metadataRaw);
  } catch {
    return null;
  }

  const longDescriptionMarkdown = await fetchRawFile(owner, name, branch, ".portfolio-data/PORTFOLIO.md") || "";

  // Build image URLs (served directly from GitHub)
  const imageNames = Array.isArray(metadata.images) ? metadata.images : [];
  const images = imageNames
    .filter(img => typeof img === "string" && !img.includes("..") && !img.includes("/"))
    .map(img => rawImageUrl(owner, name, branch, img));

  let mainImage = null;
  if (metadata.mainImage && typeof metadata.mainImage === "string" && !metadata.mainImage.includes("..")) {
    mainImage = rawImageUrl(owner, name, branch, metadata.mainImage);
  } else if (images.length > 0) {
    mainImage = images[0];
  }

  const VALID_STATUSES = ["finished", "in-progress", "abandoned", "archived"];
  const status = VALID_STATUSES.includes(metadata.status) ? metadata.status : "in-progress";

  return {
    repoName: name,
    title: metadata.title || name,
    shortDescription: metadata.shortDescription || "",
    type: metadata.type || "Other",
    status,
    languages: Array.isArray(metadata.languages) ? metadata.languages : [],
    frameworks: Array.isArray(metadata.frameworks) ? metadata.frameworks : [],
    liveUrl: metadata.liveUrl || null,
    repoUrl: repo.html_url,
    mainImage,
    images,
    usageFrequency: metadata.usageFrequency || null,
    year: metadata.year || new Date().getFullYear(),
    longDescriptionMarkdown,
  };
}

/**
 * Fetch all projects from GitHub at runtime.
 * Uses sessionStorage to cache results for the browser session.
 */
export async function fetchProjects() {
  // Check sessionStorage cache
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      sessionStorage.removeItem(CACHE_KEY);
    }
  }

  const repos = await fetchPublicRepos();

  // Process all repos concurrently
  const results = await Promise.allSettled(repos.map(processRepo));

  const projects = [];
  let undocumentedCount = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      projects.push(result.value);
    } else {
      undocumentedCount++;
    }
  }

  const data = { projects, undocumentedCount };

  // Cache in sessionStorage
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable, no big deal
  }

  return data;
}
