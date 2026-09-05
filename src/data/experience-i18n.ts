import type { Locale } from './site';

/** Spanish role titles and bullets for the four roles in experience.json, keyed by company. */
export const experienceTranslations: Record<string, { role: string; description: string[] }> = {
  'EPAM Systems': { role: 'Lead Performance Engineer', description: ['Lidero estrategia de rendimiento para backends y sistemas distribuidos en cloud, con gates de calidad en CI/CD para reducir riesgo.', 'Integro observabilidad y trabajo con ingeniería y liderazgo para encontrar restricciones, planear capacidad y crear prácticas repetibles.'] },
  'SailPoint Technologies': { role: 'Software Engineer', description: ['Desarrollé pruebas de rendimiento con k6 sobre Kubernetes en AWS y participé en mejoras de latencia y asignación de recursos documentadas en el historial profesional.', 'Exporté logs con CloudWatch y S3 para mejorar el monitoreo de sistemas con PostgreSQL.'] },
  'Globant Consulting': { role: 'Software Engineer', description: ['Diseñé pruebas cloud con k6 para escenarios de hasta 100k RPS e integré pipelines asíncronos de CI/CD.', 'Analicé resultados en New Relic para orientar recursos de Kubernetes en múltiples servicios.'] },
  'Kodda MX': { role: 'Backend Engineer', description: ['Mantuve flujos para reclamaciones médicas y pólizas en una startup aceptada en YC Summer 2021.', 'Construí autenticación, visualización y validación con JavaScript y participé en el despliegue sobre Google Cloud y Node.js.'] },
};

/** `2026-01` → `Jan 2026` / `ene 2026`; `Present` → localized. */
export function formatExperienceDate(value: string, locale: Locale): string {
  if (value === 'Present') return locale === 'es' ? 'Actual' : 'Present';
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { month: 'short', year: 'numeric' });
}
