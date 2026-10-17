export interface GitHubStats {
  stars?: number | null;
  forks?: number | null;
  prs?: number | null;
}

const REPO_URL = "https://api.github.com/repos/babelize/babelize-elements";
const PRS_URL = "https://api.github.com/search/issues?q=repo:babelize/babelize-elements+is:pr";

/**
 * Fetch GitHub metrics on the server with time-based revalidation (1 hour).
 * Uses public unauthenticated endpoints and returns null values on failure
 * so the frontend never shows 0 or an error.
 */
export async function getGitHubStats(): Promise<GitHubStats> {
  const fallback: GitHubStats = {
    stars: null,
    forks: null,
    prs: null,
  };

  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "babelize-elements",
    };

    const [repoRes, prsRes] = await Promise.allSettled([
      fetch(REPO_URL, {
        headers,
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      }),
      fetch(PRS_URL, {
        headers,
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      }),
    ]);

    const stats: GitHubStats = { ...fallback };

    if (repoRes.status === "fulfilled" && repoRes.value.ok) {
      try {
        const data = await repoRes.value.json();
        if (typeof data?.stargazers_count === "number") {
          stats.stars = data.stargazers_count;
        }
        if (typeof data?.forks_count === "number") {
          stats.forks = data.forks_count;
        }
      } catch {
        // preserve other metric if this JSON parse fails
      }
    }

    if (prsRes.status === "fulfilled" && prsRes.value.ok) {
      try {
        const data = await prsRes.value.json();
        if (typeof data?.total_count === "number") {
          stats.prs = data.total_count;
        }
      } catch {
        // preserve other metric if this JSON parse fails
      }
    }

    return stats;
  } catch {
    return fallback;
  }
}
