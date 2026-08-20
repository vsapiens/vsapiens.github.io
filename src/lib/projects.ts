export interface ProjectLinks {
  live?: string;
  repo?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  year: string;
  private: boolean;
  languages: string[];
  tech: string[];
  highlights?: string[];
  links: ProjectLinks;
}

export type ProjectStatus =
  | 'live'
  | 'beta'
  | 'building'
  | 'shipped'
  | 'oss'
  | 'archived';

interface StatusMeta {
  label: string;
  color: string;
  pulse: boolean;
}

// Semantic colors borrowed from GitHub's own palette so they read as
// native to the dark theme rather than decorative.
export const statusMeta: Record<ProjectStatus, StatusMeta> = {
  live: { label: 'Live', color: '#3fb950', pulse: true },
  beta: { label: 'Beta', color: '#d29922', pulse: true },
  building: { label: 'Building', color: '#a78bfa', pulse: true },
  shipped: { label: 'Shipped', color: '#58a6ff', pulse: false },
  oss: { label: 'Open Source', color: '#39c5cf', pulse: false },
  archived: { label: 'Archived', color: '#6e7681', pulse: false },
};

// Display order for the status board.
export const categoryOrder = [
  'Products & SaaS',
  'Performance Engineering',
  'Open Source & Tools',
  'Full-Stack & Apps',
];

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Java: '#b07219',
  Vue: '#41b883',
  'Node.js': '#3fb950',
  Swift: '#f05138',
  'C/C++': '#f34b7d',
  'C++': '#f34b7d',
  SQL: '#e38c00',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Astro: '#ff5a03',
};

export function getLanguageColor(language: string): string {
  return languageColors[language] ?? '#8b949e';
}
