import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const site = new URL('https://vsapiens.github.io');
const failures = [];
let checkedLinks = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  }));
  return files.flat();
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

function pageURL(file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -10)}`;
  return `/${relative}`;
}

async function resolvesToOutput(rawHref, sourceFile) {
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(rawHref)) return true;
  let url;
  try { url = new URL(rawHref, new URL(pageURL(sourceFile), site)); } catch { return false; }
  if (url.origin !== site.origin) return true;

  const pathname = decodeURIComponent(url.pathname);
  const clean = pathname === '/' ? '' : pathname.replace(/^\//, '').replace(/\/$/, '');
  const candidates = pathname === '/'
    ? [path.join(dist, 'index.html')]
    : path.extname(clean)
      ? [path.join(dist, clean)]
      : [path.join(dist, clean, 'index.html'), path.join(dist, `${clean}.html`)];
  return (await Promise.all(candidates.map(exists))).some(Boolean);
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (html.includes('docs.google.com/forms') || html.includes('forms.gle')) {
    failures.push(`${pageURL(file)} still contains a Google Forms embed.`);
  }

  for (const tag of html.matchAll(/<a\b[^>]*>/gi)) {
    const markup = tag[0];
    const href = markup.match(/\bhref=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean);
    if (!href) continue;
    checkedLinks += 1;
    if (!(await resolvesToOutput(href, file))) failures.push(`${pageURL(file)} links to missing output: ${href}`);

    if (/\btarget=(?:"_blank"|'_blank')/i.test(markup)) {
      const rel = markup.match(/\brel=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean) ?? '';
      const tokens = new Set(rel.toLowerCase().split(/\s+/));
      if (!tokens.has('noopener') || !tokens.has('noreferrer')) failures.push(`${pageURL(file)} has unsafe target=_blank link: ${href}`);
    }
  }
}

for (const artifact of ['404.html', 'rss.xml', 'es/rss.xml', 'sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'og-default.png', 'resume.pdf']) {
  if (!(await exists(path.join(dist, artifact)))) failures.push(`Missing required build artifact: ${artifact}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${checkedLinks} links across ${htmlFiles.length} HTML pages and all required build artifacts.`);
}
