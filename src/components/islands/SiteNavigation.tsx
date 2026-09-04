import { useState } from 'react';
import { navigation, type Locale } from '@/data/site';
import { getLocalizedPath } from '@/lib/quote';
import { Sheet } from '@/components/ui/sheet';

const copy = {
  en: { home: 'Home', open: 'Open navigation', title: 'Site navigation', language: 'Español', languageName: 'Spanish', consult: 'Discuss a project' },
  es: { home: 'Inicio', open: 'Abrir navegación', title: 'Navegación del sitio', language: 'English', languageName: 'English', consult: 'Conversemos' },
} as const;

export function SiteNavigation({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];
  const items = navigation.map((item) => ({ ...item, localizedHref: getLocalizedPath(item.href, locale) }));
  const otherLocale = locale === 'en' ? 'es' : 'en';
  const localeHref = getLocalizedPath(currentPath, otherLocale);

  const links = (mobile = false) => (
    <>
      {items.map((item) => {
        const active = currentPath === item.localizedHref || (item.id === 'writing' && currentPath.startsWith(item.localizedHref + '/'));
        return <a key={item.id} href={item.localizedHref} aria-current={active ? 'page' : undefined} onClick={mobile ? () => setOpen(false) : undefined} className="nav-link">{item.label[locale]}</a>;
      })}
    </>
  );

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label={locale === 'es' ? 'Principal' : 'Primary'}>
        <a href={getLocalizedPath('/', locale)} className="brand-mark" aria-label={t.home}>
          <span aria-hidden="true" className="brand-glyph">EG</span>
          <span>Erick González</span>
        </a>
        <div className="nav-desktop">{links()}<a className="nav-locale" href={localeHref} aria-label={t.languageName}>{t.language}</a><a className="nav-cta" href={getLocalizedPath('/contact', locale)}>{t.consult}</a></div>
        <button type="button" className="nav-menu-button" aria-label={t.open} aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button>
      </nav>
      <Sheet open={open} onOpenChange={setOpen} title={t.title}>
        <div className="sheet-links">{links(true)}<a className="nav-locale" href={localeHref}>{t.language}</a><a className="nav-cta" href={getLocalizedPath('/contact', locale)}>{t.consult}</a></div>
      </Sheet>
    </header>
  );
}
