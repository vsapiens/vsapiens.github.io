import { featuredCaseStudies, projectArchive, type CaseStudy, type Locale, type ProjectArchiveItem } from './site';

export const marketing = {
  en: {
    meta: {
      home: ['Systems Atlas', 'Erick González builds measurable, resilient backend systems, performance practices, and human-directed AI delivery workflows.'],
      work: ['Selected work', 'Six systems stories spanning performance engineering, product backends, open tooling, and human-directed AI workflows.'],
      services: ['Engineering services', 'Focused systems diagnosis, performance audits, agent workflows, and bounded backend or MVP delivery.'],
      about: ['About Erick', 'Performance engineer, backend builder, and human director of AI-assisted delivery.'],
      projects: ['Project archive', 'Fifteen products, performance tools, experiments, and open-source systems by Erick González.'],
      experience: ['Experience', 'Erick González’s experience across performance engineering, backend systems, cloud infrastructure, and technical leadership.'],
      education: ['Education', 'Computer science education and international study experience.'],
      contact: ['Contact', 'Contact Erick González about engineering roles, consulting, or technical collaboration.'],
      resume: ['Resume', 'Read or download Erick González’s resume.'],
      blog: ['Writing', 'Field notes on performance engineering, backend systems, AI workflows, and building products.'],
    },
    home: {
      kicker: 'Performance engineering · Backend systems · AI delivery',
      title: 'I make complex systems measurable, fast, and shippable.',
      intro: 'Lead Performance Engineer and product builder. I trace bottlenecks across the stack, turn architecture into working software, and direct AI agents through bounded, reviewable delivery.',
      primary: 'Explore selected work', secondary: 'Read the resume', availability: 'Open to senior engineering roles and focused consulting engagements.',
      mapTitle: 'A system is a set of decisions you can inspect.',
      mapIntro: 'Change the lens, inspect a node, and follow how human direction becomes verified output.',
      evidenceTitle: 'Evidence, with context', evidenceIntro: 'Signals from documented work—not a wall of vanity numbers.',
      workTitle: 'Six systems stories', workIntro: 'Selected for range: scale, constraints, product delivery, orchestration, and open tooling.',
      methodTitle: 'AI changes throughput. It does not own the decision.',
      methodIntro: 'Claude and Codex operate inside a human-directed engineering system with explicit roles, context, isolation, review, verification, and authorization.',
      servicesTitle: 'Focused interventions', servicesIntro: 'Useful when you need a decision, a performance baseline, a safer agent workflow, or a bounded product slice.',
      experienceTitle: 'Systems work across the stack', experienceIntro: 'Backend foundations became performance practice, then technical leadership.',
      writingTitle: 'Notes from the field', writingIntro: 'How the measurements, failures, and design constraints change the system.',
      closingTitle: 'Bring the system that refuses to explain itself.', closingBody: 'For engineering roles, consulting, or a precise technical collaboration, send the constraint and the evidence you already have.', closingCta: 'Start a conversation', closingAlt: 'View all work',
    },
    labels: { selected: 'Selected work', evidence: 'Evidence', method: 'Method', services: 'Services', experience: 'Experience', writing: 'Writing', status: 'Status', constraint: 'Constraint', approach: 'Approach', evidenceFound: 'Evidence', links: 'Links', source: 'Source', live: 'Live site', read: 'Read case study', archive: 'Project archive', current: 'Current', external: 'External' },
    work: { title: 'Systems, observed from the inside.', intro: 'Each story names the operating constraint, the engineering response, and what can honestly be claimed today.', archiveTitle: 'The wider project archive', archiveIntro: 'Fifteen shipped, active, open-source, and exploratory projects remain available at the established /projects route.' },
    services: { title: 'Small enough to govern. Deep enough to matter.', intro: 'Every engagement starts with the actual constraint and ends with inspectable evidence. Prices are fixed starting points; scope stays explicit.', priceNote: 'Starting investment', fit: 'Useful when', includes: 'What you receive', cta: 'Discuss this service', boundary: 'No hidden handoff: decisions, access, production changes, and irreversible actions stay with you.' },
    about: { title: 'I follow the request path until the story makes sense.', intro: 'I began in backend engineering and moved toward performance because the most interesting failures cross service boundaries. I now lead performance work, build product systems, and design AI-assisted delivery that keeps a person in control.', principlesTitle: 'How I work', principles: ['Measure behavior before prescribing architecture.', 'Keep decisions and evidence close to the code.', 'Use automation for throughput, never as a substitute for ownership.', 'State the boundary: what is live, paused, in development, or still unverified.'], beyondTitle: 'Current focus', beyond: 'Performance strategy for distributed backends, bounded product delivery, and agent orchestration that can be reviewed like any other engineering system.' },
    experience: { title: 'Experience built layer by layer.', intro: 'From backend delivery to cloud-scale performance testing and technical leadership.', legacy: 'This redesigned route preserves the complete work history.' },
    education: { title: 'Computer science, then systems in practice.', intro: 'Formal foundations at Tec de Monterrey and an exchange term at the University of Toronto.', degree: 'Bachelor in Computer Science', exchange: 'Exchange program', location: 'Location', certifications: 'Certifications', none: 'No public certifications listed.' },
    contact: { title: 'Tell me what the system is doing—not what you wish it did.', intro: 'Build a useful project brief below, message me directly on WhatsApp, or use email. LinkedIn and GitHub remain available for context.', whatsapp: 'Message on WhatsApp', email: 'Send an email', linkedin: 'Open LinkedIn', github: 'Browse GitHub', note: 'Please do not send credentials, customer data, or production secrets.' },
    resume: { title: 'Resume', intro: 'Performance engineering, backend systems, cloud infrastructure, and product delivery.', download: 'Download PDF', fallback: 'If the embedded viewer is unavailable, download the PDF directly.' },
    blog: { title: 'Field notes, not victory laps.', intro: 'Eight articles on load, latency, observability, agent infrastructure, and the constraints behind product work.', back: 'Back to writing', all: 'All articles', readTime: 'min read', empty: 'No articles published yet.' },
  },
  es: {
    meta: {
      home: ['Atlas de sistemas', 'Erick González construye backends medibles y resilientes, prácticas de rendimiento y flujos de IA dirigidos por personas.'],
      work: ['Trabajo seleccionado', 'Seis historias de sistemas sobre rendimiento, backends de producto, herramientas abiertas y flujos de IA dirigidos por personas.'],
      services: ['Servicios de ingeniería', 'Diagnóstico de sistemas, auditorías de rendimiento, flujos con agentes y entrega acotada de backends o MVP.'],
      about: ['Sobre Erick', 'Ingeniero de rendimiento, constructor de backends y director humano de entregas asistidas por IA.'],
      projects: ['Archivo de proyectos', 'Quince productos, herramientas de rendimiento, experimentos y sistemas de código abierto de Erick González.'],
      experience: ['Experiencia', 'Experiencia de Erick González en rendimiento, backends, infraestructura cloud y liderazgo técnico.'],
      education: ['Educación', 'Formación en ciencias computacionales y experiencia académica internacional.'],
      contact: ['Contacto', 'Contacta a Erick González sobre roles de ingeniería, consultoría o colaboración técnica.'],
      resume: ['Currículum', 'Consulta o descarga el currículum de Erick González.'],
      blog: ['Escritura', 'Notas de campo sobre rendimiento, backends, flujos de IA y construcción de productos.'],
    },
    home: {
      kicker: 'Ingeniería de rendimiento · Sistemas backend · Entrega con IA',
      title: 'Hago que los sistemas complejos sean medibles, rápidos y entregables.',
      intro: 'Lead Performance Engineer y constructor de productos. Rastreo cuellos de botella a través del stack, convierto arquitectura en software funcional y dirijo agentes de IA mediante entregas acotadas y revisables.',
      primary: 'Explorar trabajo seleccionado', secondary: 'Leer el currículum', availability: 'Disponible para roles senior de ingeniería y proyectos de consultoría enfocados.',
      mapTitle: 'Un sistema es un conjunto de decisiones que puedes inspeccionar.',
      mapIntro: 'Cambia la lente, inspecciona un nodo y sigue cómo la dirección humana se convierte en un resultado verificado.',
      evidenceTitle: 'Evidencia, con contexto', evidenceIntro: 'Señales de trabajo documentado, no una pared de métricas vanidosas.',
      workTitle: 'Seis historias de sistemas', workIntro: 'Seleccionadas por su rango: escala, restricciones, producto, orquestación y herramientas abiertas.',
      methodTitle: 'La IA cambia la velocidad. No es dueña de la decisión.',
      methodIntro: 'Claude y Codex operan dentro de un sistema de ingeniería dirigido por personas, con roles, contexto, aislamiento, revisión, verificación y autorización explícitos.',
      servicesTitle: 'Intervenciones enfocadas', servicesIntro: 'Para obtener una decisión, una línea base de rendimiento, un flujo con agentes más seguro o una porción acotada de producto.',
      experienceTitle: 'Trabajo de sistemas a través del stack', experienceIntro: 'Las bases de backend se convirtieron en práctica de rendimiento y después en liderazgo técnico.',
      writingTitle: 'Notas de campo', writingIntro: 'Cómo las mediciones, fallas y restricciones de diseño cambian el sistema.',
      closingTitle: 'Trae el sistema que se niega a explicar su comportamiento.', closingBody: 'Para roles de ingeniería, consultoría o una colaboración técnica precisa, comparte la restricción y la evidencia que ya tienes.', closingCta: 'Iniciar conversación', closingAlt: 'Ver todo el trabajo',
    },
    labels: { selected: 'Trabajo seleccionado', evidence: 'Evidencia', method: 'Método', services: 'Servicios', experience: 'Experiencia', writing: 'Escritura', status: 'Estado', constraint: 'Restricción', approach: 'Enfoque', evidenceFound: 'Evidencia', links: 'Enlaces', source: 'Código fuente', live: 'Sitio público', read: 'Leer caso de estudio', archive: 'Archivo de proyectos', current: 'Actual', external: 'Externo' },
    work: { title: 'Sistemas, observados desde adentro.', intro: 'Cada historia nombra la restricción operativa, la respuesta de ingeniería y lo que puede afirmarse con honestidad hoy.', archiveTitle: 'El archivo completo', archiveIntro: 'Quince proyectos entregados, activos, abiertos y exploratorios siguen disponibles en la ruta /es/projects.' },
    services: { title: 'Lo bastante pequeño para gobernarlo. Lo bastante profundo para importar.', intro: 'Cada colaboración parte de la restricción real y termina con evidencia inspeccionable. Los precios son puntos de partida fijos; el alcance permanece explícito.', priceNote: 'Inversión inicial', fit: 'Útil cuando', includes: 'Lo que recibes', cta: 'Conversar sobre este servicio', boundary: 'Sin entrega oculta: decisiones, accesos, producción y acciones irreversibles permanecen bajo tu control.' },
    about: { title: 'Sigo la ruta de la petición hasta que la historia tiene sentido.', intro: 'Comencé en backend y me moví hacia rendimiento porque las fallas más interesantes cruzan los límites entre servicios. Hoy lidero trabajo de rendimiento, construyo productos y diseño entregas asistidas por IA que mantienen a una persona en control.', principlesTitle: 'Cómo trabajo', principles: ['Medir el comportamiento antes de prescribir arquitectura.', 'Mantener las decisiones y la evidencia cerca del código.', 'Usar automatización para aumentar capacidad, nunca para sustituir responsabilidad.', 'Nombrar el límite: qué está público, pausado, en desarrollo o sin verificar.'], beyondTitle: 'Enfoque actual', beyond: 'Estrategia de rendimiento para backends distribuidos, entrega acotada de producto y orquestación de agentes que puede revisarse como cualquier otro sistema de ingeniería.' },
    experience: { title: 'Experiencia construida capa por capa.', intro: 'De la entrega backend a pruebas de rendimiento en cloud y liderazgo técnico.', legacy: 'Esta ruta rediseñada preserva el historial profesional completo.' },
    education: { title: 'Ciencias computacionales y sistemas en la práctica.', intro: 'Bases formales en el Tec de Monterrey y un semestre de intercambio en University of Toronto.', degree: 'Licenciatura en Ciencias Computacionales', exchange: 'Programa de intercambio', location: 'Ubicación', certifications: 'Certificaciones', none: 'No hay certificaciones públicas listadas.' },
    contact: { title: 'Cuéntame qué hace el sistema, no qué desearías que hiciera.', intro: 'Construye abajo un resumen útil del proyecto, escríbeme por WhatsApp o usa correo. LinkedIn y GitHub siguen disponibles para contexto.', whatsapp: 'Escribir por WhatsApp', email: 'Enviar correo', linkedin: 'Abrir LinkedIn', github: 'Explorar GitHub', note: 'No envíes credenciales, datos de clientes ni secretos de producción.' },
    resume: { title: 'Currículum', intro: 'Rendimiento, sistemas backend, infraestructura cloud y entrega de producto.', download: 'Descargar PDF', fallback: 'Si el visor integrado no está disponible, descarga el PDF directamente.' },
    blog: { title: 'Notas de campo, no vueltas de victoria.', intro: 'Ocho artículos sobre carga, latencia, observabilidad, infraestructura de agentes y las restricciones detrás del trabajo de producto.', back: 'Volver a escritura', all: 'Todos los artículos', readTime: 'min de lectura', empty: 'Todavía no hay artículos publicados.' },
  },
} as const;

export interface LocalizedCaseStudy {
  slug: CaseStudy['slug'];
  title: string;
  summary: string;
  status: string;
  tags: readonly string[];
  constraint: string;
  approach: string;
  evidence: readonly string[];
  note: string;
  links: readonly { label: string; href: string; kind: 'live' | 'source' | 'article' }[];
}

const caseDetails: Record<CaseStudy['slug'], Omit<LocalizedCaseStudy, 'title' | 'summary' | 'status' | 'tags' | 'slug'> & { es: Omit<LocalizedCaseStudy, 'slug' | 'tags' | 'links'> }> = {
  'performance-at-scale': {
    constraint: 'Peak behavior cannot be inferred from a passing functional suite.',
    approach: 'Model realistic load, observe the generators and system together, then move p95/p99 and error thresholds into delivery gates.',
    evidence: ['A documented 100k RPS cloud test scenario', 'Distributed k6 execution and New Relic analysis', 'Smaller CI performance gates for regression detection'],
    note: 'Professional examples are summarized without exposing client systems or confidential data.',
    links: [{ label: 'Load testing at 100k RPS', href: '/blog/load-testing-at-100k-rps', kind: 'article' }],
    es: { title: 'Rendimiento a escala', summary: 'Pruebas de carga y observabilidad para encontrar restricciones antes de que se conviertan en incidentes.', status: 'Práctica de ingeniería de rendimiento', constraint: 'El comportamiento en picos no puede inferirse de una suite funcional en verde.', approach: 'Modelar carga realista, observar generadores y sistema en conjunto, y llevar umbrales p95/p99 y de error a los gates de entrega.', evidence: ['Escenario cloud documentado de 100k RPS', 'Ejecución distribuida con k6 y análisis en New Relic', 'Gates de rendimiento más pequeños en CI'], note: 'Los ejemplos profesionales se resumen sin exponer sistemas de clientes ni datos confidenciales.' },
  },
  vitrina: {
    constraint: 'Create a useful website from the digital traces a local business already has, while keeping each demo inexpensive and inspectable.',
    approach: 'A zero-runtime-dependency Node API coordinates safe research, browser escalation, LLM generation, single-file publishing, and cold archival.',
    evidence: ['Public site remains available at vitrinamx.mx', 'Production Node API has zero runtime dependencies', 'Per-demo spend caps and a layered research pipeline'],
    note: 'The production WhatsApp Business channel is paused after the platform account was disabled; the public site remains available.',
    links: [{ label: 'Vitrina public site', href: 'https://vitrinamx.mx', kind: 'live' }, { label: 'Zero node_modules article', href: '/blog/shipping-a-saas-with-zero-node-modules', kind: 'article' }],
    es: { title: 'Vitrina', summary: 'Generador de sitios desde WhatsApp para negocios locales mexicanos, con un backend Node sin dependencias.', status: 'Sitio público disponible; canal de WhatsApp de producción pausado', constraint: 'Crear un sitio útil a partir de las huellas digitales que un negocio local ya tiene, manteniendo cada demo económico e inspeccionable.', approach: 'Una API Node sin dependencias en runtime coordina investigación segura, escalamiento a navegador, generación con LLM, publicación en un archivo y archivo en frío.', evidence: ['El sitio público sigue disponible en vitrinamx.mx', 'La API Node de producción no tiene dependencias en runtime', 'Topes de gasto por demo y pipeline de investigación por capas'], note: 'El canal de WhatsApp Business de producción está pausado después de que la cuenta de plataforma fue deshabilitada; el sitio público permanece disponible.' },
  },
  'miso-os': {
    constraint: 'Define one product contract while backend and conformance tooling evolve at different speeds.',
    approach: 'FastAPI is the product backend. A separate Go compiler and conformance harness validates contracts without being presented as the serving application.',
    evidence: ['Product routes live in the FastAPI backend', 'Go is scoped to compilation and conformance', 'Integration and deployment remain unfinished'],
    note: 'MISO OS is in development. It is not deployed or fully integrated.',
    links: [],
    es: { title: 'MISO OS', summary: 'Punto de venta en desarrollo: FastAPI es el backend del producto y Go compila y valida contratos.', status: 'En desarrollo; todavía no está desplegado ni integrado por completo', constraint: 'Definir un contrato de producto mientras el backend y las herramientas de conformidad evolucionan a distintas velocidades.', approach: 'FastAPI es el backend del producto. Un compilador y arnés de conformidad separado en Go valida contratos sin presentarse como la aplicación que sirve el producto.', evidence: ['Las rutas del producto viven en el backend FastAPI', 'Go está acotado a compilación y conformidad', 'La integración y el despliegue siguen pendientes'], note: 'MISO OS está en desarrollo. No está desplegado ni integrado por completo.' },
  },
  agentos: {
    constraint: 'Multiple agents lose decisions, collide on files, and drift when coordination lives only in chat.',
    approach: 'Encode roles and workflows as reviewable files, isolate workers with git worktrees, and gate changes with review and verification.',
    evidence: ['A 22-role orchestration model', 'Declarative Markdown/YAML workflow chains', 'Isolated multi-worker execution as an explicit system constraint'],
    note: 'AgentOS is a work in progress and its public surface is a beta preview, not a claim of finished autonomy.',
    links: [{ label: 'AgentOS beta preview', href: 'https://agentos-beta.vercel.app', kind: 'live' }, { label: 'Architecture article', href: '/blog/an-operating-system-for-ai-agents', kind: 'article' }],
    es: { title: 'AgentOS', summary: 'Sistema operativo agnóstico de agentes, en desarrollo, para entrega de producto dirigida por personas.', status: 'En desarrollo activo', constraint: 'Varios agentes pierden decisiones, colisionan en archivos y se desvían cuando la coordinación existe solo en el chat.', approach: 'Codificar roles y flujos como archivos revisables, aislar workers con git worktrees y pasar cambios por revisión y verificación.', evidence: ['Modelo de orquestación con 22 roles', 'Cadenas declarativas en Markdown/YAML', 'Ejecución aislada de múltiples workers como restricción explícita'], note: 'AgentOS está en desarrollo y su superficie pública es un preview beta, no una afirmación de autonomía terminada.' },
  },
  'mx-stock-analyzer': {
    constraint: 'Make Mexican-equities analysis legible in both languages while keeping reusable market-data tooling separate from the product.',
    approach: 'Build the product over reusable TypeScript market-data packages, then layer scoring, narratives, quotas, and portfolio workflows at the application boundary.',
    evidence: ['Bilingual product surface for BMV/SIC analysis', 'Reusable @mx-market package foundation', 'Two-level quota controls described in the project archive'],
    note: 'Presented as a portfolio product case study; it is not investment advice or a performance claim.',
    links: [{ label: 'Product site', href: 'https://main.de0yc4smewhxn.amplifyapp.com', kind: 'live' }, { label: 'mx-market-tools source', href: 'https://github.com/vsapiens/mx-market-tools', kind: 'source' }],
    es: { title: 'MX Stock Analyzer', summary: 'Producto bilingüe de análisis de acciones mexicanas construido sobre herramientas abiertas reutilizables.', status: 'Caso de estudio del portafolio de producto', constraint: 'Hacer legible el análisis de acciones mexicanas en ambos idiomas y separar las herramientas reutilizables del producto.', approach: 'Construir sobre paquetes TypeScript reutilizables de datos de mercado y agregar scoring, narrativas, cuotas y flujos de portafolio en la capa de aplicación.', evidence: ['Superficie bilingüe para análisis BMV/SIC', 'Base reutilizable de paquetes @mx-market', 'Controles de cuota en dos niveles descritos en el archivo'], note: 'Se presenta como caso del portafolio; no es consejo de inversión ni una afirmación de rendimiento financiero.' },
  },
  'open-source-performance-toolkit': {
    constraint: 'Performance evidence is often delayed because test generation and readable observability require too much setup.',
    approach: 'Separate deterministic OpenAPI transformation from constrained LLM enrichment, and package observability and inference benchmarks as inspectable tools.',
    evidence: ['k6gen generates runnable k6 tests from OpenAPI', 'A one-command k6, Prometheus, and Grafana stack', 'Open LLM inference benchmarks for TTFT and token latency'],
    note: 'The toolkit is a group of open repositories, not a single hosted product.',
    links: [{ label: 'k6gen source', href: 'https://github.com/vsapiens/k6gen', kind: 'source' }, { label: 'Observability stack source', href: 'https://github.com/vsapiens/k6-observability-stack', kind: 'source' }, { label: 'Load-generation article', href: '/blog/generating-load-tests-from-openapi-with-llms', kind: 'article' }],
    es: { title: 'Kit de rendimiento de código abierto', summary: 'Herramientas abiertas para generar pruebas, ejecutar benchmarks e inspeccionar evidencia de rendimiento.', status: 'Herramientas de código abierto', constraint: 'La evidencia de rendimiento suele llegar tarde porque generar pruebas y montar observabilidad legible requiere demasiado trabajo.', approach: 'Separar la transformación determinista de OpenAPI del enriquecimiento acotado con LLM, y empaquetar observabilidad y benchmarks de inferencia como herramientas inspeccionables.', evidence: ['k6gen genera pruebas ejecutables de k6 desde OpenAPI', 'Stack de k6, Prometheus y Grafana en un comando', 'Benchmarks abiertos de inferencia para TTFT y latencia entre tokens'], note: 'El kit agrupa repositorios abiertos; no es un solo producto alojado.' },
  },
};

const spanishCaseLinkLabels: Record<string, string> = {
  'Load testing at 100k RPS': 'Pruebas de carga a 100k RPS',
  'Vitrina public site': 'Sitio público de Vitrina',
  'Zero node_modules article': 'Artículo sobre cero node_modules',
  'AgentOS beta preview': 'Preview beta de AgentOS',
  'Architecture article': 'Artículo de arquitectura',
  'Product site': 'Sitio del producto',
  'mx-market-tools source': 'Código de mx-market-tools',
  'k6gen source': 'Código de k6gen',
  'Observability stack source': 'Código del stack de observabilidad',
  'Load-generation article': 'Artículo sobre generación de carga',
};

export function getCaseStudy(slug: string, locale: Locale): LocalizedCaseStudy | undefined {
  const base = featuredCaseStudies.find((item) => item.slug === slug);
  if (!base) return undefined;
  const detail = caseDetails[base.slug];
  if (locale === 'es') return { slug: base.slug, tags: base.tags, links: detail.links.map((link) => ({ ...link, label: spanishCaseLinkLabels[link.label] ?? link.label, href: link.href.startsWith('/blog/') ? `/es${link.href}` : link.href })), ...detail.es };
  return { slug: base.slug, title: base.title.en, summary: base.summary.en, status: base.status.en, tags: base.tags, constraint: detail.constraint, approach: detail.approach, evidence: detail.evidence, note: detail.note, links: detail.links };
}

export function getCaseStudies(locale: Locale): LocalizedCaseStudy[] {
  return featuredCaseStudies.map((item) => getCaseStudy(item.slug, locale)!);
}

type ProjectTranslation = Pick<ProjectArchiveItem, 'tagline' | 'description'> & { category?: string; highlights?: string[] };

const projectTranslations: Record<string, ProjectTranslation> = {
  vitrina: { tagline: 'Generador de sitios web desde WhatsApp para negocios locales de México', description: 'Plataforma que convierte una conversación de WhatsApp en un sitio de un solo archivo: integra Instagram y Google Maps, genera un demo de 24 horas y gestiona suscripciones con Stripe.', category: 'Productos y SaaS', highlights: ['API Node escrita sin dependencias de runtime para facilitar auditoría', 'Investigación por capas con topes de gasto por demo', 'Archivo en frío para reactivar demos con costo inactivo mínimo'] },
  'mx-stock-analyzer': { tagline: 'Análisis de acciones con IA para el mercado mexicano', description: 'SaaS bilingüe que analiza acciones mexicanas con un modelo técnico de seis señales, narrativas generadas con Claude, backtests y portafolios con cobro en MXN.', category: 'Productos y SaaS', highlights: ['Motor de scoring de seis señales sobre datos BMV/SIC', 'Cuotas en Redis y Supabase con devolución ante fallas', 'Construido sobre paquetes abiertos @mx-market'] },
  agentos: { tagline: 'Sistema agnóstico de agentes para entregar productos con equipos de IA', description: 'Capa de orquestación en desarrollo con 22 roles y flujos declarativos en Markdown/YAML para llevar un contexto de producto hacia un MVP revisable.', category: 'Productos y SaaS', highlights: ['Contratos de agentes y cadenas YAML declarativas', 'Workers paralelos aislados con git worktrees', 'Stack y controles de seguridad integrados a los gates'] },
  k6gen: { tagline: 'Genera pruebas k6 desde OpenAPI con apoyo de LLM', description: 'CLI que transforma una especificación OpenAPI en pruebas k6 ejecutables mediante un núcleo determinista y una pasada acotada de LLM; incluye GitHub Action.', category: 'Ingeniería de rendimiento' },
  'k6-observability-stack': { tagline: 'Observabilidad lista para k6, Prometheus y Grafana', description: 'Stack de pruebas en un comando con k6 conectado a Prometheus y dashboards preconfigurados de Grafana.', category: 'Ingeniería de rendimiento' },
  'llm-inference-load-testing': { tagline: 'Benchmarks de endpoints LLM bajo modelos de carga reales', description: 'Suite que mide TTFT, latencia entre tokens y tokens por segundo en endpoints compatibles con OpenAI y Ollama.', category: 'Ingeniería de rendimiento' },
  'mx-market-tools': { tagline: 'Herramientas abiertas para analizar acciones de la BMV', description: 'Paquetes TypeScript @mx-market para obtener y analizar datos del mercado mexicano, reutilizados por MX Stock Analyzer.', category: 'Código abierto y herramientas' },
  chesslearn: { tagline: 'Ajedrez con amistades o bots y análisis posterior con Stockfish', description: 'Aplicación de ajedrez que explica errores, mejores jugadas y cambios de evaluación después de cada partida.', category: 'Código abierto y herramientas' },
  'weekly-radar-mix': { tagline: 'Archiva automáticamente tu mezcla semanal de Spotify', description: 'Automatización en Python que copia una playlist semanal a una lista fechada mediante una tarea programada en GitHub Actions.', category: 'Código abierto y herramientas' },
  'apodaca-dashboard': { tagline: 'Plataforma multi-evento de acreditaciones', description: 'Backend Flask con portales aislados para administración, empresas y check-in, lector QR, chat y manejo cifrado de registros personales.', category: 'Aplicaciones full-stack' },
  atlas: { tagline: 'Plataforma personal de inversión con ciclo diario de decisiones', description: 'Plataforma local-first de paper trading con estrategia, gate de riesgo, ejecución y bitácora para mantener cada decisión revisable.', category: 'Aplicaciones full-stack' },
  librosmx: { tagline: 'Marketplace de intercambio de libros para México', description: 'Marketplace mobile-first para publicar, buscar e intercambiar libros con acceso de Google, búsqueda y etiquetas por género.', category: 'Aplicaciones full-stack' },
  learnhub: { tagline: 'Plataforma freemium para cursos en video', description: 'Plataforma donde creadores publican lecciones y evaluaciones y estudiantes compran, reproducen y siguen su avance.', category: 'Aplicaciones full-stack' },
  gymzo: { tagline: 'Seguimiento fitness MERN con analítica de progreso', description: 'Aplicación full-stack para registrar rutinas y analizar IMC, avance de fuerza y consistencia.', category: 'Aplicaciones full-stack' },
  evolith: { tagline: 'Juego RTS 2D de simulación evolutiva', description: 'Juego de escritorio para guiar una especie mediante supervivencia, mutación, depredadores y comandos de enjambre.', category: 'Aplicaciones full-stack' },
};

export function getLocalizedProjects(locale: Locale): ProjectArchiveItem[] {
  if (locale === 'en') return projectArchive.map((project) => ({ ...project, links: { ...project.links } }));
  return projectArchive.map((project) => ({ ...project, ...projectTranslations[project.slug], links: { ...project.links } }));
}

export const serviceDetails = {
  diagnosis: {
    fit: { en: 'You have symptoms, competing explanations, or a costly decision without a shared technical picture.', es: 'Tienes síntomas, explicaciones que compiten o una decisión costosa sin una lectura técnica compartida.' },
    includes: { en: ['Evidence review', 'Constraint map', 'Prioritized next experiment'], es: ['Revisión de evidencia', 'Mapa de restricciones', 'Siguiente experimento priorizado'] },
  },
  'performance-audit': {
    fit: { en: 'Latency, throughput, reliability, or infrastructure cost changes under realistic traffic.', es: 'Latencia, throughput, confiabilidad o costo de infraestructura cambian bajo tráfico realista.' },
    includes: { en: ['Workload model', 'Measured bottleneck analysis', 'Remediation plan and gates'], es: ['Modelo de carga', 'Análisis medido de cuellos de botella', 'Plan de remediación y gates'] },
  },
  'agent-workflow': {
    fit: { en: 'AI agents produce output, but roles, context, review, or authorization remain informal.', es: 'Los agentes producen resultados, pero roles, contexto, revisión o autorización siguen siendo informales.' },
    includes: { en: ['Role and context contracts', 'Isolation and review workflow', 'Verification and human-control gates'], es: ['Contratos de roles y contexto', 'Flujo de aislamiento y revisión', 'Gates de verificación y control humano'] },
  },
  'backend-mvp': {
    fit: { en: 'A product needs one bounded, testable backend slice before broader investment.', es: 'Un producto necesita una porción backend acotada y comprobable antes de una inversión mayor.' },
    includes: { en: ['Scope and architecture boundary', 'Implemented product slice', 'Tests, runbook, and handoff'], es: ['Alcance y límite de arquitectura', 'Porción funcional de producto', 'Pruebas, runbook y entrega'] },
  },
} as const;

export const methodSteps = {
  en: [
    { id: 'roles', title: 'Roles before prompts', body: 'A person assigns the outcome. Claude plans or reviews; Codex executes an approved, bounded task. Neither silently inherits authority.' },
    { id: 'context', title: 'Context as a versioned artifact', body: 'Requirements, decisions, constraints, and stop conditions live close to the work so they can be inspected and corrected.' },
    { id: 'isolation', title: 'Isolated execution', body: 'Work happens in a branch or worktree with a named file boundary. Deviations are reported rather than hidden inside a large diff.' },
    { id: 'review', title: 'Review and verification', body: 'Tests, static checks, builds, and visual evidence support review. Passing a command does not replace checking the promised outcome.' },
    { id: 'authorization', title: 'Human authorization', body: 'A person approves production, OAuth, credentials, payments, merges, and irreversible actions. The workflow accelerates judgment; it does not outsource it.' },
  ],
  es: [
    { id: 'roles', title: 'Roles antes que prompts', body: 'Una persona asigna el resultado. Claude planea o revisa; Codex ejecuta una tarea aprobada y acotada. Ninguno hereda autoridad en silencio.' },
    { id: 'context', title: 'Contexto como artefacto versionado', body: 'Requisitos, decisiones, restricciones y condiciones de alto viven cerca del trabajo para poder inspeccionarlos y corregirlos.' },
    { id: 'isolation', title: 'Ejecución aislada', body: 'El trabajo ocurre en una rama o worktree con un límite de archivos nombrado. Las desviaciones se reportan en vez de esconderse en un diff enorme.' },
    { id: 'review', title: 'Revisión y verificación', body: 'Pruebas, checks estáticos, builds y evidencia visual sostienen la revisión. Un comando en verde no sustituye comprobar el resultado prometido.' },
    { id: 'authorization', title: 'Autorización humana', body: 'Una persona aprueba producción, OAuth, credenciales, pagos, merges y acciones irreversibles. El flujo acelera el juicio; no lo delega.' },
  ],
} as const;
