import { useEffect, useState } from 'react';
import type { Locale } from '@/data/site';
import { resolveInitialLane, type ContactLane } from '@/lib/quote';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CONTACT_LANES_ID = 'contact-lanes';
const lanes: readonly ContactLane[] = ['hiring', 'consulting'];

const copy = {
  en: { label: 'Contact lanes', hiring: ['Hiring', 'Roles, résumé, and work history'], consulting: ['Consulting', 'Fixed-price engagements and a project brief'] },
  es: { label: 'Carriles de contacto', hiring: ['Contratar', 'Roles, currículum e historial'], consulting: ['Consultoría', 'Proyectos a precio fijo y un resumen de proyecto'] },
} as const;

/**
 * Switches between the two server-rendered lane panels on /contact. The panels live outside this
 * island (so their content, including the quote wizard, is in the HTML before hydration); the island
 * only owns the tablist and toggles `hidden` on the panels by id.
 */
export function ContactLanes({ locale }: { locale: Locale }) {
  const [lane, setLane] = useState<ContactLane>('consulting');
  const t = copy[locale];

  useEffect(() => {
    setLane(resolveInitialLane(window.location.search, window.location.hash));
    document.documentElement.removeAttribute('data-lane');
  }, []);

  useEffect(() => {
    for (const candidate of lanes) {
      const panel = document.getElementById(`${CONTACT_LANES_ID}-panel-${candidate}`);
      if (panel) panel.hidden = candidate !== lane;
    }
  }, [lane]);

  const select = (next: string) => {
    const value = next as ContactLane;
    setLane(value);
    const url = new URL(window.location.href);
    url.searchParams.set('lane', value);
    url.hash = '';
    window.history.replaceState(window.history.state, '', url);
  };

  return (
    <Tabs value={lane} onValueChange={select} id={CONTACT_LANES_ID}>
      <TabsList label={t.label} className="lane-switch">
        {lanes.map((candidate, index) => (
          <TabsTrigger key={candidate} value={candidate}>
            <span className="lane-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="lane-name">{t[candidate][0]}</span>
            <span className="lane-hint">{t[candidate][1]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
