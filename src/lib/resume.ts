import experience from '../data/experience.json';
import { experienceTranslations, formatExperienceDate } from '../data/experience-i18n';
import { contact, type Locale } from '../data/site';

const labels = {
  en: { title: 'Lead Performance Engineer · Backend systems · AI delivery', experience: 'Experience', tech: 'Tech', pdf: 'Resume PDF' },
  es: { title: 'Lead Performance Engineer · Sistemas backend · Entrega con IA', experience: 'Experiencia', tech: 'Tecnologías', pdf: 'CV en PDF' },
} as const;

/** The work history as plain Markdown a recruiter can paste into a tracker, email, or chat. Content comes only from experience.json. */
export function buildResumeMarkdown(locale: Locale): string {
  const t = labels[locale];
  const header = [
    '# Erick González',
    t.title,
    `${contact.email} · github.com/vsapiens · linkedin.com/in/erickfgonzalez`,
    `${t.pdf}: https://vsapiens.github.io/resume.pdf`,
  ];
  const jobs = experience.map((job) => {
    const localized = locale === 'es' ? experienceTranslations[job.company] : undefined;
    const dates = `${formatExperienceDate(job.startDate, locale)} — ${formatExperienceDate(job.endDate, locale)}`;
    return [
      `### ${localized?.role ?? job.role} — ${job.company} (${dates})`,
      ...(localized?.description ?? job.description).map((line) => `- ${line}`),
      `${t.tech}: ${job.tech.join(', ')}`,
    ].join('\n');
  });
  return [...header, '', `## ${t.experience}`, '', jobs.join('\n\n'), ''].join('\n');
}
