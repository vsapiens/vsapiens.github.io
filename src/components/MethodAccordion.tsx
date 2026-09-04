import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { methodSteps } from '@/data/content';
import type { Locale } from '@/data/site';

export function MethodAccordion({ locale }: { locale: Locale }) {
  return (
    <Accordion defaultValue="roles" className="method-accordion">
      {methodSteps[locale].map((step, index) => (
        <AccordionItem value={step.id} key={step.id}>
          <AccordionTrigger><span className="method-trigger-index">{String(index + 1).padStart(2, '0')}</span>{step.title}</AccordionTrigger>
          <AccordionContent>{step.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
