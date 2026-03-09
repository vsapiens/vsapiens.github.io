export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

const GITHUB_USERNAME = 'vsapiens';

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Astro: '#ff5a03',
};

export function getLanguageColor(language: string): string {
  return languageColors[language] ?? '#8b949e';
}

export async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'vsapiens-portfolio',
      },
    }
  );

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status}`);
    return [];
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => r.name !== GITHUB_USERNAME);
}
