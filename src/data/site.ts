import projectsData from './projects.json';

export const localeCodes = ['en', 'es'] as const;
export type Locale = (typeof localeCodes)[number];
export type LocalizedText = Record<Locale, string>;

export interface NavigationItem {
  id: 'work' | 'services' | 'about' | 'writing' | 'contact';
  href: string;
  label: LocalizedText;
}

export const locales: Record<Locale, { label: string; pathPrefix: string; htmlLang: string }> = {
  en: { label: 'English', pathPrefix: '', htmlLang: 'en' },
  es: { label: 'Español', pathPrefix: '/es', htmlLang: 'es-MX' },
};

export const navigation: readonly NavigationItem[] = [
  { id: 'work', href: '/work', label: { en: 'Work', es: 'Trabajo' } },
  { id: 'services', href: '/services', label: { en: 'Services', es: 'Servicios' } },
  { id: 'about', href: '/about', label: { en: 'About', es: 'Perfil' } },
  { id: 'writing', href: '/blog', label: { en: 'Writing', es: 'Escritura' } },
  { id: 'contact', href: '/contact', label: { en: 'Contact', es: 'Contacto' } },
];

export interface Price {
  usd: number;
  mxn: number;
}

export type ServiceId = 'diagnosis' | 'performance-audit' | 'agent-workflow' | 'backend-mvp';

export interface ServiceCredit {
  /** Days after the engagement during which its fee is credited toward the target service. */
  windowDays: number;
  towardServiceId: ServiceId;
}

export interface Service {
  id: ServiceId;
  name: LocalizedText;
  description: LocalizedText;
  price: Price;
  /** Estimated elapsed time for the engagement, shown next to the price. */
  duration: LocalizedText;
  pricing: 'fixed';
  credit?: ServiceCredit;
}

export const services: readonly Service[] = [
  {
    id: 'diagnosis',
    name: { en: 'Systems diagnosis', es: 'Diagnóstico de sistemas' },
    description: {
      en: 'A focused technical readout of the constraint, evidence, and next experiment.',
      es: 'Una lectura técnica enfocada de la restricción, la evidencia y el siguiente experimento.',
    },
    price: { usd: 500, mxn: 10000 },
    duration: { en: '3–5 working days', es: '3–5 días hábiles' },
    pricing: 'fixed',
    credit: { windowDays: 30, towardServiceId: 'performance-audit' },
  },
  {
    id: 'performance-audit',
    name: { en: 'Performance audit', es: 'Auditoría de rendimiento' },
    description: {
      en: 'A load, latency, and observability review with a prioritized remediation plan.',
      es: 'Una revisión de carga, latencia y observabilidad con un plan de remediación priorizado.',
    },
    price: { usd: 1500, mxn: 30000 },
    duration: { en: '2–3 weeks', es: '2–3 semanas' },
    pricing: 'fixed',
  },
  {
    id: 'agent-workflow',
    name: { en: 'Agent workflow', es: 'Flujo de trabajo con agentes' },
    description: {
      en: 'A human-directed AI workflow designed around roles, controls, and verification.',
      es: 'Un flujo de IA dirigido por personas, diseñado alrededor de roles, controles y verificación.',
    },
    price: { usd: 2500, mxn: 50000 },
    duration: { en: '3–4 weeks', es: '3–4 semanas' },
    pricing: 'fixed',
  },
  {
    id: 'backend-mvp',
    name: { en: 'Backend / MVP', es: 'Backend / MVP' },
    description: {
      en: 'A bounded backend or MVP engagement with explicit delivery and validation milestones.',
      es: 'Un engagement acotado de backend o MVP con hitos explícitos de entrega y validación.',
    },
    price: { usd: 5000, mxn: 100000 },
    duration: { en: '6–10 weeks', es: '6–10 semanas' },
    pricing: 'fixed',
  },
];

export const contact = {
  whatsappNumber: '528120008400',
  email: 'iamerickfrank@gmail.com',
  github: 'https://github.com/vsapiens',
  linkedin: 'https://www.linkedin.com/in/erickfgonzalez/',
} as const;

export interface EvidenceMetric {
  value: string;
  label: LocalizedText;
  context: LocalizedText;
}

export const evidenceMetrics: readonly EvidenceMetric[] = [
  {
    value: '100k RPS',
    label: { en: 'load-test scenario', es: 'escenario de pruebas de carga' },
    context: { en: 'Documented performance-engineering write-up.', es: 'Documentado en un artículo de ingeniería de rendimiento.' },
  },
  {
    value: '22 roles',
    label: { en: 'in the AgentOS workflow model', es: 'en el modelo de flujos de AgentOS' },
    context: { en: 'A work-in-progress orchestration system.', es: 'Un sistema de orquestación en desarrollo.' },
  },
  {
    value: '0 dependencies',
    label: { en: 'in Vitrina\'s production Node API', es: 'en la API Node de producción de Vitrina' },
    context: { en: 'The public site is available; the production WhatsApp channel is paused.', es: 'El sitio público está disponible; el canal de WhatsApp de producción está pausado.' },
  },
];

export interface ExperienceEvidence extends EvidenceMetric {
  /** Provenance guard: the excerpt must appear verbatim in that company's entry in experience.json. */
  source: { company: string; excerpt: string };
}

/** Numbers from the documented work history, shown next to prices so the offer is anchored in evidence, not adjectives. */
export const experienceEvidence: readonly ExperienceEvidence[] = [
  {
    value: '300k TPS',
    label: { en: 'auto-scaling backend throughput', es: 'throughput de backend autoescalable' },
    context: { en: 'Kodda MX (YC S21), Backend Engineer, 2020–2021', es: 'Kodda MX (YC S21), Backend Engineer, 2020–2021' },
    source: { company: 'Kodda MX', excerpt: 'up to 300k TPS' },
  },
  {
    value: '10s → 50ms',
    label: { en: 'response-time improvement after k6 performance work', es: 'mejora de tiempo de respuesta tras pruebas con k6' },
    context: { en: 'SailPoint Technologies, Kubernetes on AWS, 2024–2025', es: 'SailPoint Technologies, Kubernetes en AWS, 2024–2025' },
    source: { company: 'SailPoint Technologies', excerpt: 'from 10s to 50ms' },
  },
  {
    value: '100k RPS',
    label: { en: 'cloud load-test ceiling', es: 'techo de pruebas de carga en cloud' },
    context: { en: 'Globant Consulting, dealer auction platform, 2022–2023', es: 'Globant Consulting, plataforma de subastas, 2022–2023' },
    source: { company: 'Globant Consulting', excerpt: 'up to 100k RPS' },
  },
];

export interface CaseStudy {
  slug: 'performance-at-scale' | 'vitrina' | 'miso-os' | 'agentos' | 'mx-stock-analyzer' | 'open-source-performance-toolkit';
  title: LocalizedText;
  summary: LocalizedText;
  status: LocalizedText;
  tags: readonly string[];
}

export const featuredCaseStudies: readonly CaseStudy[] = [
  {
    slug: 'performance-at-scale',
    title: { en: 'Performance at Scale', es: 'Rendimiento a escala' },
    summary: { en: 'Load and observability work focused on finding constraints before they become customer incidents.', es: 'Trabajo de carga y observabilidad enfocado en encontrar restricciones antes de que se conviertan en incidentes de clientes.' },
    status: { en: 'Performance engineering practice', es: 'Práctica de ingeniería de rendimiento' },
    tags: ['k6', 'observability', 'systems'],
  },
  {
    slug: 'vitrina',
    title: { en: 'Vitrina', es: 'Vitrina' },
    summary: { en: 'A WhatsApp-native website generator for local Mexican businesses, with a zero-dependency Node backend.', es: 'Un generador de sitios web nativo de WhatsApp para negocios locales mexicanos, con un backend Node sin dependencias.' },
    status: { en: 'Public site available; production WhatsApp channel paused', es: 'Sitio público disponible; canal de WhatsApp de producción pausado' },
    tags: ['Node.js', 'Playwright', 'LLM workflows'],
  },
  {
    slug: 'miso-os',
    title: { en: 'MISO OS', es: 'MISO OS' },
    summary: { en: 'An in-development point-of-sale system whose FastAPI service is the product backend; Go compiles and validates contracts.', es: 'Un sistema de punto de venta en desarrollo cuyo servicio FastAPI es el backend del producto; Go compila y valida contratos.' },
    status: { en: 'In development', es: 'En desarrollo' },
    tags: ['FastAPI', 'Go', 'contracts'],
  },
  {
    slug: 'agentos',
    title: { en: 'AgentOS', es: 'AgentOS' },
    summary: { en: 'A work-in-progress, agent-agnostic operating system for human-directed product delivery.', es: 'Un sistema operativo en desarrollo y agnóstico de agentes para entrega de productos dirigida por personas.' },
    status: { en: 'In active development', es: 'En desarrollo activo' },
    tags: ['AI agents', 'worktrees', 'verification'],
  },
  {
    slug: 'mx-stock-analyzer',
    title: { en: 'MX Stock Analyzer', es: 'MX Stock Analyzer' },
    summary: { en: 'A bilingual Mexican-equities analysis product built on reusable open-source market-data tooling.', es: 'Un producto bilingüe de análisis de acciones mexicanas construido sobre herramientas reutilizables de datos de mercado de código abierto.' },
    status: { en: 'Product portfolio case study', es: 'Caso de estudio del portafolio de producto' },
    tags: ['TypeScript', 'market data', 'AI'],
  },
  {
    slug: 'open-source-performance-toolkit',
    title: { en: 'Open-source Performance Toolkit', es: 'Kit de rendimiento de código abierto' },
    summary: { en: 'Open tooling for generating load tests, running benchmarks, and making performance evidence easier to inspect.', es: 'Herramientas abiertas para generar pruebas de carga, ejecutar benchmarks y hacer más fácil inspeccionar la evidencia de rendimiento.' },
    status: { en: 'Open-source tools', es: 'Herramientas de código abierto' },
    tags: ['OpenAPI', 'k6', 'Grafana'],
  },
];

export type ProjectStatus = 'live' | 'beta' | 'building' | 'shipped' | 'oss' | 'archived';

export interface ProjectArchiveItem {
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
  links: { live?: string; repo?: string };
}

// This preserves the existing, curated fifteen-project archive as the source of truth.
export const projectArchive = projectsData as ProjectArchiveItem[];
