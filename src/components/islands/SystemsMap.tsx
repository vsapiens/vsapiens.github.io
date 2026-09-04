import { useMemo, useState } from 'react';
import type { Locale } from '@/data/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Lens = 'delivery' | 'performance' | 'product';
type NodeId = 'direction' | 'context' | 'execution' | 'verification' | 'authorization';

const nodes: { id: NodeId; step: number; x: number; y: number }[] = [
  { id: 'direction', step: 1, x: 12, y: 25 },
  { id: 'context', step: 2, x: 37, y: 12 },
  { id: 'execution', step: 3, x: 52, y: 56 },
  { id: 'verification', step: 4, x: 74, y: 26 },
  { id: 'authorization', step: 5, x: 87, y: 68 },
];

const content = {
  en: {
    tabs: { delivery: 'Delivery', performance: 'Performance', product: 'Product' },
    lensLabel: 'System lens',
    modes: { overview: 'Overview', dependencies: 'Dependencies' },
    nodeNames: { direction: 'Human direction', context: 'Bounded context', execution: 'Isolated execution', verification: 'Verification', authorization: 'Human authorization' },
    lensCopy: {
      delivery: 'Human direction defines the work; isolated execution creates evidence for review.',
      performance: 'Observe under load, trace the constraint, change one layer, and measure again.',
      product: 'Frame the user problem, build a bounded slice, then authorize the next release.',
    },
    evidence: {
      direction: 'Intent before automation', context: 'Decisions stay inspectable', execution: 'Changes stay contained', verification: 'Evidence before authorization', authorization: 'A person owns release',
    },
    detail: {
      direction: 'A person sets the objective, scope, constraints, and stop conditions.',
      context: 'Roles receive the source material and decisions they need—no hidden context.',
      execution: 'Codex works in an isolated checkout and reports deviations instead of silently expanding scope.',
      verification: 'Claude or a designated reviewer checks the diff against tests, review, and observed output.',
      authorization: 'Production, OAuth, money movement, and irreversible actions remain human decisions.',
    },
    inspect: 'Inspect', open: 'Open', position: 'position', dialogIntro: 'This node is part of a human-directed workflow.',
  },
  es: {
    tabs: { delivery: 'Entrega', performance: 'Rendimiento', product: 'Producto' },
    lensLabel: 'Lente del sistema',
    modes: { overview: 'Resumen', dependencies: 'Dependencias' },
    nodeNames: { direction: 'Dirección humana', context: 'Contexto acotado', execution: 'Ejecución aislada', verification: 'Verificación', authorization: 'Autorización humana' },
    lensCopy: {
      delivery: 'La dirección humana define el trabajo; la ejecución aislada crea evidencia para revisión.',
      performance: 'Observar bajo carga, rastrear la restricción, cambiar una capa y volver a medir.',
      product: 'Enmarcar el problema, construir una porción acotada y autorizar el siguiente lanzamiento.',
    },
    evidence: {
      direction: 'Intención antes de automatizar', context: 'Decisiones inspeccionables', execution: 'Cambios contenidos', verification: 'Evidencia antes de autorizar', authorization: 'Una persona autoriza',
    },
    detail: {
      direction: 'Una persona establece objetivo, alcance, restricciones y condiciones de alto.',
      context: 'Cada rol recibe las fuentes y decisiones necesarias, sin contexto oculto.',
      execution: 'Codex trabaja en un checkout aislado y reporta desviaciones sin ampliar el alcance en silencio.',
      verification: 'Claude o la persona revisora contrasta el diff con pruebas, revisión y resultados observados.',
      authorization: 'Producción, OAuth, movimientos de dinero y acciones irreversibles siguen siendo decisiones humanas.',
    },
    inspect: 'Inspeccionar', open: 'Abrir', position: 'posición', dialogIntro: 'Este nodo forma parte de un flujo dirigido por personas.',
  },
} as const;

export function SystemsMap({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [lens, setLens] = useState<Lens>('delivery');
  const [mode, setMode] = useState('overview');
  const [selected, setSelected] = useState<NodeId>('direction');
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedNode = useMemo(() => nodes.find((node) => node.id === selected)!, [selected]);

  return (
    <div className="systems-map-shell">
      <Tabs value={lens} onValueChange={(value) => setLens(value as Lens)}>
        <div className="map-controls">
          <TabsList label={t.lensLabel}>
            {(Object.keys(t.tabs) as Lens[]).map((key) => <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>)}
          </TabsList>
          <RadioGroup value={mode} onValueChange={setMode} label={locale === 'es' ? 'Detalle del mapa' : 'Map detail'} className="flex gap-2">
            <RadioGroupItem value="overview" checked={mode === 'overview'}>{t.modes.overview}</RadioGroupItem>
            <RadioGroupItem value="dependencies" checked={mode === 'dependencies'}>{t.modes.dependencies}</RadioGroupItem>
          </RadioGroup>
        </div>
        {(Object.keys(t.tabs) as Lens[]).map((key) => <TabsContent key={key} value={key} className="map-lens-copy">{t.lensCopy[key]}</TabsContent>)}
      </Tabs>

      <div className="systems-map-field" aria-label={locale === 'es' ? 'Mapa interactivo de sistemas' : 'Interactive systems map'}>
        <svg viewBox="0 0 100 80" className="map-lines" aria-hidden="true" preserveAspectRatio="none">
          <path d="M12 25 L37 12 L52 56 L74 26 L87 68" />
          <path d="M12 25 Q48 0 87 68" className="map-orbit" />
        </svg>
        {mode === 'dependencies' && <><span className="dependency-label dependency-a">context → execution</span><span className="dependency-label dependency-b">review → authorization</span></>}
        {nodes.map((node) => (
          <button key={node.id} type="button" aria-label={`${t.inspect} ${t.nodeNames[node.id]}`} aria-pressed={selected === node.id} className="map-node" style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => setSelected(node.id)}>
            <span className="map-node-index">{String(node.step).padStart(2, '0')}</span>
            <span>{t.nodeNames[node.id]}</span>
          </button>
        ))}
      </div>

      <div className="map-readout" aria-live="polite">
        <div>
          <Badge tone={selected === 'authorization' ? 'coral' : 'violet'}>{t.nodeNames[selected]}</Badge>
          <p className="mt-3 text-lg font-semibold text-ink">{t.evidence[selected]}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-ink">{t.detail[selected]}</p>
        </div>
        <div className="map-progress">
          <span className="font-mono text-xs text-muted-ink">{selectedNode.step}/5</span>
          <Progress value={selectedNode.step * 20} label={`${t.nodeNames[selected]} ${t.position}`} />
          <Button variant="secondary" onClick={() => setDialogOpen(true)} aria-label={`${t.open} ${t.nodeNames[selected]} detail`}>{locale === 'es' ? 'Ver detalle' : 'Open detail'}</Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title={t.nodeNames[selected]} description={t.dialogIntro}>
        <p className="leading-7 text-muted-ink">{t.detail[selected]}</p>
      </Dialog>
    </div>
  );
}
