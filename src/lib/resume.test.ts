import { expect, test } from 'vitest';
import experience from '../data/experience.json';
import { buildResumeMarkdown } from './resume';

test('renders the work history as recruiter-pasteable Markdown', () => {
  const markdown = buildResumeMarkdown('en');
  expect(markdown.startsWith('# Erick González\n')).toBe(true);
  expect(markdown).toContain('iamerickfrank@gmail.com');
  expect(markdown).toContain('https://vsapiens.github.io/resume.pdf');
  expect(markdown).toContain('### Lead Performance Engineer — EPAM Systems (Jan 2026 — Present)');
  expect(markdown).toContain('### Backend Engineer — Kodda MX (Aug 2020 — Dec 2021)');
  const bullets = markdown.split('\n').filter((line) => line.startsWith('- '));
  expect(bullets).toHaveLength(experience.reduce((total, job) => total + job.description.length, 0));
  expect(markdown).toContain('Tech: Kubernetes, AWS, k6, PostgreSQL, CloudWatch, S3');
});

test('uses the Spanish translations for roles and bullets', () => {
  const markdown = buildResumeMarkdown('es');
  expect(markdown).toContain('## Experiencia');
  expect(markdown).toContain('(ene 2026 — Actual)');
  expect(markdown).toContain('- Lidero estrategia de rendimiento');
  expect(markdown).not.toContain('Lead performance engineering for backend');
});
