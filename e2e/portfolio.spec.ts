import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const caseSlugs = [
  'performance-at-scale',
  'vitrina',
  'miso-os',
  'agentos',
  'mx-stock-analyzer',
  'open-source-performance-toolkit',
];

const routeInventory = [
  '/', '/es', '/work', '/es/work', '/services', '/es/services', '/about', '/es/about',
  '/projects', '/es/projects', '/experience', '/es/experience', '/education', '/es/education',
  '/contact', '/es/contact', '/resume', '/es/resume', '/blog', '/es/blog',
  ...caseSlugs.flatMap((slug) => [`/work/${slug}`, `/es/work/${slug}`]),
  '/blog/load-testing-at-100k-rps', '/es/blog/load-testing-at-100k-rps',
];

async function completeQuote(page: Page, locale: 'en' | 'es') {
  const spanish = locale === 'es';
  await expect(page.getByRole('radio', { name: spanish ? /Diagnóstico de sistemas/ : /Performance audit/ })).toBeChecked();
  await page.getByRole('button', { name: spanish ? 'Continuar' : 'Continue' }).click();

  const situation = page.locator('#quote-situation');
  await page.getByRole('button', { name: spanish ? 'Continuar' : 'Continue' }).click();
  await expect(situation).toBeFocused();
  await situation.fill(spanish ? 'La latencia cambia bajo carga real.' : 'Latency changes under realistic load.');
  await page.getByRole('button', { name: spanish ? 'Continuar' : 'Continue' }).click();

  await page.getByRole('radio', { name: spanish ? /Dentro de 2/ : /Within 2/ }).check();
  await page.getByRole('button', { name: spanish ? 'Continuar' : 'Continue' }).click();
  await page.locator('#quote-budget').fill(spanish ? 'Equipo pequeño; necesitamos evidencia y un plan.' : 'Small team; we need evidence and a plan.');
  await page.getByRole('button', { name: spanish ? 'Crear resumen' : 'Create brief' }).click();
  return page.locator('.quote-result pre');
}

test('routes, bilingual metadata, structured data, and mobile navigation stay coherent', async ({ page, request }) => {
  for (const route of routeInventory) {
    const response = await request.get(route);
    expect(response.status(), `${route} should render`).toBe(200);
    expect(await response.text()).toContain('<main');
  }

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('measurable, fast, and shippable');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vsapiens.github.io/');
  await expect(page.locator('link[hreflang="es-MX"]')).toHaveAttribute('href', 'https://vsapiens.github.io/es');
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://vsapiens.github.io/');
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '{}');
  expect(schema['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['Person', 'ProfessionalService']);
  expect(schema['@graph'][1].offers).toHaveLength(8);

  await page.getByLabel('Spanish').click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'WhatsApp' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\/528120008400\?text=/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the quote flow validates, preserves answers, and hands off exact bilingual briefs', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/services');
  for (const price of ['USD 500', 'USD 1,500', 'USD 2,500', 'USD 5,000']) await expect(page.getByText(price, { exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Discuss this service/ }).nth(1).click();
  await expect(page).toHaveURL(/\/contact\?service=performance-audit#quote$/);
  const englishBrief = await completeQuote(page, 'en');
  await expect(englishBrief).toContainText('Service: Performance audit');
  await expect(englishBrief).toContainText('Investment: USD 1,500');
  const englishText = await englishBrief.textContent();
  const whatsappHref = await page.getByRole('link', { name: 'Send by WhatsApp' }).getAttribute('href');
  expect(new URL(whatsappHref!).searchParams.get('text')).toBe(englishText);
  await expect(page.getByRole('link', { name: 'Send by email' })).toHaveAttribute('href', /^mailto:iamerickfrank@gmail\.com\?/);
  await page.getByRole('button', { name: 'Copy brief' }).click();
  await expect(page.getByRole('status')).toHaveText('Brief copied.');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText().then((text) => text.replace(/\r\n/g, '\n')))).toBe(englishText?.replace(/\r\n/g, '\n'));
  await page.getByRole('button', { name: 'Edit answers' }).click();
  await expect(page.getByRole('radio', { name: /Performance audit/ })).toBeChecked();

  await page.goto('/es/contact?service=diagnosis#quote');
  const spanishBrief = await completeQuote(page, 'es');
  await expect(spanishBrief).toContainText('Servicio: Diagnóstico de sistemas');
  await expect(spanishBrief).toContainText('Inversión: MXN 10,000');
});

test('case-study boundaries and static delivery artifacts remain truthful and available', async ({ page, request }) => {
  await page.goto('/work/vitrina');
  await expect(page.getByText(/production WhatsApp channel (?:is )?paused/i).first()).toBeVisible();
  await page.goto('/es/work/miso-os');
  await expect(page.getByText(/FastAPI es el backend del producto/).first()).toBeVisible();
  await expect(page.getByText(/No está desplegado ni integrado por completo/)).toBeVisible();

  for (const artifact of ['/resume.pdf', '/rss.xml', '/es/rss.xml', '/sitemap-index.xml', '/sitemap-0.xml', '/robots.txt', '/og-default.png']) {
    const response = await request.get(artifact);
    expect(response.status(), `${artifact} should exist`).toBe(200);
  }
  await page.goto('/resume');
  await expect(page.getByRole('link', { name: 'Download PDF' }).first()).toHaveAttribute('href', '/resume.pdf');
  const missing = await page.goto('/not-a-real-atlas-node');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Signal lost');
});

test('key desktop, mobile, and quote states meet the compact accessibility gate', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 667 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  }

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Continue' }).click();
  const quoteResults = await new AxeBuilder({ page }).include('#quote').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(quoteResults.violations).toEqual([]);
});
