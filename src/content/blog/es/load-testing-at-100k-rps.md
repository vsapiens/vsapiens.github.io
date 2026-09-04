---
title: "Lo que aprendí ejecutando pruebas de carga a 100,000 peticiones por segundo"
description: "Lecciones al diseñar pruebas k6 a escala cloud para una plataforma de subastas: ejecución distribuida, tráfico en ráfagas y lo que realmente muestra New Relic."
date: 2023-08-20
tags: ["rendimiento", "k6", "pruebas-de-carga", "cloud", "ci-cd"]
---

## Crees que conoces las pruebas de carga. No es así

Antes de entrar a Globant pensaba que probar carga era escribir un script, aumentar usuarios virtuales y mirar un dashboard. Estaba equivocado. Las pruebas reales a escala son una disciplina de ingeniería propia, y la parte más difícil no tiene que ver con la herramienta.

En Globant fui responsable de validar el rendimiento de una plataforma de subastas de vehículos con pujas en vivo. El tráfico máximo aparecía en ráfagas predecibles: eventos de 30 a 90 minutos con miles de participantes concurrentes. Una sola puja perdida significaba ingresos perdidos y distribuidores molestos.

El objetivo era demostrar que la plataforma soportaba 100,000 peticiones por segundo durante una subasta simulada.

## La configuración

Usamos k6 para los scripts, distribuido en varias máquinas virtuales cloud para generar suficiente carga. Una sola máquina alcanza aproximadamente 10,000 a 15,000 RPS según la complejidad del escenario. Para llegar a 100k necesitábamos coordinar 12 generadores.

```javascript
// Escenario de ráfaga de subasta en k6
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failRate = new Rate('failed_requests');

export const options = {
  scenarios: {
    auction_burst: {
      executor: 'ramping-arrival-rate',
      startRate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 5000,
      maxVUs: 10000,
      stages: [
        { target: 5000, duration: '1m' },   // subida
        { target: 8500, duration: '2m' },   // sostenido
        { target: 8500, duration: '5m' },   // pico
        { target: 0, duration: '30s' },     // drenado
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1200'],
    failed_requests: ['rate<0.01'],
  },
};

export default function () {
  const res = http.post(`${__ENV.BASE_URL}/api/bids`, JSON.stringify({
    auctionId: `auction-${Math.floor(Math.random() * 50)}`,
    dealerId: `dealer-${__ENV.VU_ID}`,
    amount: Math.floor(Math.random() * 50000) + 10000,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, { 'status is 200': (r) => r.status === 200 });
  failRate.add(res.status !== 200);
}
```

Cada generador ejecutaba una parte del escenario, alrededor de 8,500 RPS. Coordinamos el inicio con un script de shell sencillo que entraba por SSH a cada VM e iniciaba k6 al mismo tiempo.

## Las tres cosas que me sorprendieron

**1. Los generadores son el primer cuello de botella.** Las primeras ejecuciones mostraron timeouts, pero el problema no era la aplicación: las máquinas de prueba agotaban sus descriptores de archivo. Perdimos dos días depurando la app antes de entender que habíamos saturado la infraestructura de pruebas. Monitorea siempre tus generadores.

**2. Una distribución realista de datos importa más que el volumen bruto.** La primera prueba distribuía IDs de subastas uniformemente. En producción, 80% del tráfico llegaba a tres o cuatro subastas activas. Al cambiar a una distribución ponderada, el patrón de hotspots en la base de datos cambió por completo y la latencia se duplicó. La prueba «en verde» ocultaba un problema real.

**3. La integración con CI/CD es donde vive el valor.** Una gran prueba ejecutada una vez demuestra un punto. Una prueba menor —5,000 RPS durante 60 segundos— en cada despliegue detecta regresiones antes de que se acumulen. Integramos k6 al pipeline:

```yaml
# Paso de GitHub Actions
- name: Performance smoke test
  run: |
    k6 run --out json=results.json \
      -e BASE_URL=${{ secrets.STAGING_URL }} \
      tests/perf/smoke-auction.js
  timeout-minutes: 5

- name: Check thresholds
  run: |
    node scripts/check-perf-thresholds.js results.json
```

Esto detectó una regresión de latencia de 3x causada por un cambio de ORM que había pasado todas las pruebas unitarias y de integración.

## Leer los resultados

New Relic era nuestra capa de observabilidad. El error de muchos equipos es mirar promedios. Los promedios mienten. Durante la prueba a 100k RPS, el tiempo promedio era de 120 ms, aparentemente perfecto. Pero p99 era de 4.2 segundos: 1,000 peticiones por segundo eran inaceptablemente lentas.

La corrección estaba en el pool de conexiones. La base permitía 100 conexiones y las peticiones formaban una cola bajo carga. Subir a 200 y agregar PgBouncer redujo p99 de 4.2 segundos a 380 ms.

## La lección

Probar carga no significa demostrar que el sistema funciona. Significa encontrar la forma concreta en que se rompe. Todo sistema se rompe ante cierto nivel de concurrencia, patrón de datos o límite de recursos. El trabajo consiste en encontrar ese punto antes que las personas usuarias y decidir si corregirlo o aceptarlo.

Llegamos a 100k RPS. Más importante: encontramos y corregimos cuatro errores con impacto de producción que las pruebas funcionales nunca habrían detectado. Ese es el verdadero retorno de la inversión.
