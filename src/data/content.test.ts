import { expect, test } from 'vitest';
import { getCaseStudy, getLocalizedProjects } from './content';

test('localizes the project archive without losing source links or entries', () => {
  const english = getLocalizedProjects('en');
  const spanish = getLocalizedProjects('es');
  const englishVitrina = english.find((project) => project.slug === 'vitrina');
  const spanishVitrina = spanish.find((project) => project.slug === 'vitrina');

  expect(spanish).toHaveLength(15);
  expect(spanishVitrina).toMatchObject({
    tagline: 'Generador de sitios web desde WhatsApp para negocios locales de México',
    links: englishVitrina?.links,
  });
  expect(spanishVitrina?.description).not.toBe(englishVitrina?.description);
});

test('returns a localized case study while preserving its factual status qualifier', () => {
  expect(getCaseStudy('miso-os', 'es')).toMatchObject({
    title: 'MISO OS',
    status: 'En desarrollo; todavía no está desplegado ni integrado por completo',
  });
  expect(getCaseStudy('vitrina', 'en')?.status).toBe('Public site available; production WhatsApp channel paused');
});

test('localizes Spanish case-study link labels and article destinations', () => {
  expect(getCaseStudy('vitrina', 'es')?.links).toEqual([
    { label: 'Sitio público de Vitrina', href: 'https://vitrinamx.mx', kind: 'live' },
    { label: 'Artículo sobre cero node_modules', href: '/es/blog/shipping-a-saas-with-zero-node-modules', kind: 'article' },
  ]);
});

test('returns undefined for a case-study slug that is not published', () => {
  expect(getCaseStudy('not-a-story', 'en')).toBeUndefined();
});
