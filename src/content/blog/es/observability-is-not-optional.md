---
title: "La observabilidad no es opcional: cómo el monitoreo redujo el tiempo de indisponibilidad"
description: "Cómo dashboards de CloudWatch, exportación de logs a S3 y alertas accionables transformaron la respuesta a incidentes en SailPoint."
date: 2025-09-05
tags: ["observabilidad", "aws", "cloudwatch", "monitoreo", "devops"]
---

## Volar a ciegas

Cuando me incorporé al equipo de ingeniería de rendimiento de SailPoint, la plataforma de gobierno de identidades tenía monitoreo como muchos equipos lo tienen: técnicamente existía. Había un dashboard de CloudWatch construido un año antes, algunas alarmas que sonaban tan seguido que todos habían silenciado el canal de Slack y, cuando algo fallaba, el proceso era entrar por SSH, buscar en los logs y esperar que las líneas relevantes no hubieran rotado.

El tiempo promedio para identificar una causa raíz era de 47 minutos. Un incidente duraba en promedio una hora con 52 minutos. Dedicábamos cerca de 14 horas al mes a incidentes, y la mitad de ese tiempo se iba en descubrir qué se había roto.

Llegué para mejorar rendimiento, pero quedó claro que no puedes optimizar lo que no puedes ver.

## Construir la capa de observabilidad

No reemplazamos todo. Agregamos observabilidad a la infraestructura existente durante unas seis semanas. Esto fue lo que construimos:

**1. Logging estructurado y con contexto.** El primer cambio fue volver útiles los logs. Estandarizamos JSON con IDs de correlación para seguir una petición entre servicios.

```javascript
// Antes: inútil al agregar datos
console.log('Processing request for tenant');

// Después: consultable y rastreable
logger.info({
  event: 'request.processing',
  tenantId: req.tenantId,
  correlationId: req.headers['x-correlation-id'],
  service: 'identity-resolver',
  latencyMs: Date.now() - startTime,
});
```

**2. Dashboards de CloudWatch que responden preguntas.** El dashboard anterior mostraba CPU y memoria: útil para capacidad, poco útil durante incidentes. Organizamos nuevos dashboards alrededor del comportamiento que perciben las personas:

- **Flujo de peticiones:** tasa de peticiones, errores y latencia p50/p95/p99 por endpoint.
- **Salud de dependencias:** uso del pool de conexiones, tasa de aciertos de caché y latencia de APIs downstream.
- **Métricas del negocio:** éxito de aprovisionamiento y finalización de sincronizaciones de identidad.

```json
{
  "metrics": [
    ["Custom/IdentityPlatform", "RequestLatencyP95",
     "Endpoint", "/api/v1/identities",
     { "stat": "p95", "period": 60 }],
    ["Custom/IdentityPlatform", "ErrorRate",
     "Endpoint", "/api/v1/identities",
     { "stat": "Average", "period": 60 }]
  ],
  "view": "timeSeries",
  "period": 60
}
```

**3. Exportación a S3 para análisis posterior.** La retención en CloudWatch se vuelve costosa. Configuramos Kinesis Firehose para exportar logs a S3 en Parquet, particionados por fecha y servicio. Consultar una semana completa pasó de ser «imposible» a una consulta de Athena de 30 segundos.

```sql
-- Errores de un tenant durante las últimas 24 horas
SELECT timestamp, service, event, message, correlationId
FROM logs
WHERE tenantId = 'tenant-abc123'
  AND level = 'error'
  AND dt = '2025-09-01'
ORDER BY timestamp DESC
LIMIT 100;
```

**4. Alertas accionables con runbooks.** Eliminamos las alarmas anteriores y comenzamos de cero. Cada alarma nueva requería un umbral basado en SLO, un mensaje de Slack con contexto y un runbook enlazado.

```yaml
AlarmName: IdentityAPI-P95-Latency-Breach
MetricName: RequestLatencyP95
Namespace: Custom/IdentityPlatform
Threshold: 500
ComparisonOperator: GreaterThanThreshold
EvaluationPeriods: 3
Period: 60
AlarmActions:
  - !Ref OpsSnsTopic
```

Cuando se activa, la notificación indica que p95 superó 500 ms durante tres minutos, muestra el valor actual, enlaza el runbook e identifica el último despliegue. No se limita a decir «alarma activada».

## Los resultados

Medimos tres meses frente al mismo periodo del año anterior:

| Métrica | Antes | Después | Cambio |
|---------|-------|---------|--------|
| Tiempo medio de detección | 12 min | 2 min | -83% |
| Tiempo medio de resolución | 112 min | 68 min | -39% |
| Horas mensuales de incidentes | 14 h | 6 h | -57% |
| Incidentes detectados antes del reporte de usuario | 15% | 72% | +380% |

La reducción cercana a 40% del tiempo de indisponibilidad provino de dos fuentes: detectar problemas antes de que fueran interrupciones y resolver incidentes más rápido porque podíamos ver la causa en minutos, en vez de adivinar.

## Lo que muchos equipos hacen mal

Observabilidad no significa dashboards. Los dashboards son la salida. Observabilidad es instrumentar un sistema para poder responder «por qué» ante un evento inesperado sin desplegar código ni agregar logging.

Los tres errores más comunes que veo son:

1. **Monitorear infraestructura en vez de comportamiento.** CPU a 80% no es un problema. Personas recibiendo errores 500 sí lo es. Comienza por lo que experimentan y recorre el sistema hacia atrás.
2. **Fatiga de alertas.** Si el equipo silenció el canal, las alertas son ruido. Pocas alertas de calidad con runbooks superan una pared roja.
3. **Tratar observabilidad como proyecto.** No es algo que construyes una vez. Cada feature, servicio o cambio de esquema necesita responder: «¿cómo sabremos que esto está roto?».

No puedes mejorar lo que no puedes medir ni reparar lo que no puedes ver. La observabilidad no es un extra: es la base de todo lo demás.
