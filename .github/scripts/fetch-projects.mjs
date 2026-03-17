#!/usr/bin/env node
/**
 * fetch-projects.js
 *
 * Runs at CI build time (before `npm run build`) to pull project metadata,
 * markdown descriptions, and images from every GitHub repo that contains a
 * `.portfolio-data/` folder, then writes:
 *   - public/projects.json          — consumed by the frontend
 *   - public/projects/{repo}/…      — image assets
 *
 * Environment variables (set via GitHub Secrets in deploy.yml):
 *   GITHUB_TOKEN    — PAT with `repo` scope
 *   GITHUB_USERNAME — account whose repos are scanned (e.g. "SirBepy")
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(REPO_ROOT, "public");

const TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

if (!TOKEN || !USERNAME) {
  console.error(
    "ERROR: GITHUB_TOKEN and GITHUB_USERNAME environment variables are required."
  );
  process.exit(1);
}

const API_BASE = "https://api.github.com";

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "portfolio-fetch-projects",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function githubGet(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status} for ${url}: ${body}`);
  }
  return res.json();
}

/** Fetch all pages of a paginated GitHub API endpoint. */
async function githubGetAll(path) {
  const results = [];
  let url = `${API_BASE}${path}`;

  while (url) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`GitHub API ${res.status} for ${url}: ${body}`);
    }
    const page = await res.json();
    results.push(...page);

    // Parse Link header for next page
    const link = res.headers.get("link") || "";
    const nextMatch = link.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : null;
  }

  return results;
}

/**
 * Fetch a file from a repo via the Contents API.
 * Returns null if the file does not exist (404).
 */
async function fetchRepoFile(owner, repo, filePath) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status} for ${url}: ${body}`);
  }
  return res.json();
}

/** Download a binary file from a URL and save it to dest. */
async function downloadFile(downloadUrl, dest) {
  const res = await fetch(downloadUrl, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Download failed ${res.status} for ${downloadUrl}`);
  }
  const buffer = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(buffer));
}

// ---------------------------------------------------------------------------
// Per-repo ingestion
// ---------------------------------------------------------------------------

/**
 * Attempts to read .portfolio-data/metadata.json for a repo.
 * Returns null if the folder/file doesn't exist.
 * Throws on unexpected errors.
 */
async function fetchMetadata(owner, repo) {
  const file = await fetchRepoFile(owner, repo, ".portfolio-data/metadata.json");
  if (!file) return null;

  // Contents API returns base64-encoded content
  const raw = Buffer.from(file.content, "base64").toString("utf-8");
  return JSON.parse(raw);
}

/**
 * Attempts to read .portfolio-data/PORTFOLIO.md for a repo.
 * Returns empty string if not found.
 */
async function fetchMarkdown(owner, repo) {
  const file = await fetchRepoFile(owner, repo, ".portfolio-data/PORTFOLIO.md");
  if (!file) return "";
  return Buffer.from(file.content, "base64").toString("utf-8");
}

/**
 * Downloads all images listed in metadata.images from .portfolio-data/.
 * Returns the list of successfully downloaded image paths (/projects/{repo}/…).
 */
async function downloadImages(owner, repo, images) {
  const destDir = path.join(PUBLIC_DIR, "projects", repo);
  const successful = [];

  for (const imageName of images) {
    // SECURITY: Prevent directory traversal by sanitizing the image name
    if (typeof imageName !== "string" || imageName.includes("..") || imageName.includes("/") || imageName.includes("\\")) {
      console.warn(`  WARN [${repo}] Skipping unsafe image name: "${imageName}"`);
      continue;
    }

    const remotePath = `.portfolio-data/${imageName}`;
    const localDest = path.join(destDir, imageName);
    const publicPath = `/projects/${repo}/${imageName}`;

    // Double check that the resolved localDest is still within destDir
    const resolvedPath = path.resolve(localDest);
    const resolvedDestDir = path.resolve(destDir);
    if (!resolvedPath.startsWith(resolvedDestDir)) {
      console.warn(`  WARN [${repo}] Skipping image due to path traversal attempt: "${imageName}"`);
      continue;
    }

    try {
      const file = await fetchRepoFile(owner, repo, remotePath);
      if (!file) {
        console.warn(`  WARN [${repo}] Image not found: ${imageName}`);
        continue;
      }

      // Use download_url for binary files to avoid base64 size limits
      const downloadUrl = file.download_url;
      await downloadFile(downloadUrl, localDest);
      successful.push(publicPath);
    } catch (err) {
      console.warn(`  WARN [${repo}] Failed to download image "${imageName}": ${err.message}`);
    }
  }

  return successful;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Fetching repos for ${USERNAME}…`);

  // 1. List all repos (full pagination)
  let repos;
  try {
    const allRepos = await githubGetAll(`/user/repos?per_page=100&type=all`);
    // Filter to only include repos owned by the target user
    repos = allRepos.filter(r => r.owner.login.toLowerCase() === USERNAME.toLowerCase());
  } catch (err) {
    console.error(`FATAL: Could not list repos — ${err.message}`);
    process.exit(1);
  }

  console.log(`Found ${repos.length} repos. Scanning for .portfolio-data/…`);

  const projects = [];
  let undocumentedCount = 0;

  for (const repo of repos) {
    const repoName = repo.name;
    const owner = repo.owner.login;

    try {
      // 2. Fetch metadata
      let metadata;
      try {
        metadata = await fetchMetadata(owner, repoName);
      } catch (err) {
        console.warn(`  WARN [${repoName}] Could not read metadata.json: ${err.message}`);
        undocumentedCount++;
        continue;
      }

      if (!metadata) {
        undocumentedCount++;
        continue;
      }

      console.log(`  [${repoName}] Found metadata`);

      // 3. Fetch markdown description
      let longDescriptionMarkdown = "";
      try {
        longDescriptionMarkdown = await fetchMarkdown(owner, repoName);
      } catch (err) {
        console.warn(`  WARN [${repoName}] Could not read PORTFOLIO.md: ${err.message}`);
      }

      // 4. Download images
      const imageNames = Array.isArray(metadata.images) ? metadata.images : [];
      const downloadedImages = await downloadImages(owner, repoName, imageNames);

      // Determine mainImage path
      let mainImage = null;
      if (metadata.mainImage) {
        const mainImagePath = `/projects/${repoName}/${metadata.mainImage}`;
        if (downloadedImages.includes(mainImagePath)) {
          mainImage = mainImagePath;
        } else {
          console.warn(`  WARN [${repoName}] mainImage "${metadata.mainImage}" could not be downloaded`);
        }
      } else if (downloadedImages.length > 0) {
        mainImage = downloadedImages[0];
      }

      // 5. Build project entry
      const VALID_STATUSES = ["finished", "in-progress", "abandoned", "archived"];
      let status = metadata.status;
      if (!VALID_STATUSES.includes(status)) {
        console.warn(`  WARN [${repoName}] Invalid status "${status}". Defaulting to "in-progress".`);
        status = "in-progress";
      }

      const project = {
        repoName,
        title: metadata.title || repoName,
        shortDescription: metadata.shortDescription || "",
        type: metadata.type || "Other",
        status: status,
        languages: Array.isArray(metadata.languages) ? metadata.languages : [],
        frameworks: Array.isArray(metadata.frameworks) ? metadata.frameworks : [],
        liveUrl: metadata.liveUrl || null,
        repoUrl: repo.private ? null : repo.html_url,
        mainImage,
        images: downloadedImages,
        usageFrequency: metadata.usageFrequency || null,
        year: metadata.year || new Date().getFullYear(),
        longDescriptionMarkdown,
      };

      projects.push(project);
      console.log(`  [${repoName}] Ingested successfully`);
    } catch (err) {
      console.warn(`  WARN [${repoName}] Unexpected error, skipping: ${err.message}`);
      undocumentedCount++;
    }
  }

  // 6. Write projects.json
  const output = { projects, undocumentedCount };
  const outputPath = path.join(PUBLIC_DIR, "projects.json");

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(
    `\nDone. ${projects.length} project(s) documented, ${undocumentedCount} undocumented.`
  );
  console.log(`Output written to ${outputPath}`);
}

main();
