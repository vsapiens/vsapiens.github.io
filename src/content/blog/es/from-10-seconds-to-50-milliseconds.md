---
title: "De 10 segundos a 50 milisegundos: una historia de optimización"
description: "Diagnóstico de una regresión de latencia de 200x en Kubernetes sobre AWS: la investigación, la corrección y el ahorro anual de infraestructura documentado."
date: 2025-04-15
tags: ["rendimiento", "kubernetes", "aws", "k6", "optimización"]
---

## La alerta que arruinó un viernes

A las 3:47 de la tarde de un viernes se activó una alerta de Datadog: la latencia p95 de la API de resolución de identidades había superado ocho segundos. La línea base normal era de unos 400 ms. Cuando abrí el dashboard, el promedio era de 10.2 segundos. Las peticiones de usuarios expiraban y los tickets de soporte se acumulaban.

Esto ocurrió en SailPoint, en un servicio que atendía búsquedas de gobierno de identidades en tiempo real. Cuando se volvía lento, clientes empresariales no podían otorgar o retirar accesos. Para un producto de seguridad no es solo un problema de rendimiento, sino un riesgo de cumplimiento.

## La investigación

El primer instinto fue culpar al despliegue. Habíamos publicado una versión esa mañana. Sin embargo, revertirla no resolvió nada: la latencia siguió en diez segundos. Eso descartó el código de aplicación.

Después revisé el clúster de Kubernetes. Los pods estaban activos, los health checks pasaban y no había reinicios. CPU y memoria parecían normales a nivel de pod. Al revisar métricas de los nodos apareció algo distinto: uno de los tres nodos del grupo usaba 94% de memoria, mientras los otros estaban en 45%.

```bash
# El comando que abrió el caso
kubectl top pods -n identity --sort-by=memory
```

Un pod consumía 3.2 GB frente a un request de 2 GB y un límite de 4 GB. Kubernetes no lo terminaba porque seguía bajo el límite, pero el nodo estaba usando swap. Cuando un nodo hace swap, todos los pods de ese nodo sufren.

## La causa raíz

Era una consulta. Una sola consulta en la ruta de resolución funcionaba bien cuando el cliente promedio tenía 50,000 identidades. Un cliente empresarial acababa de incorporarse con 2.3 millones, y la consulta hacía un join sin índice sobre todo su conjunto.

```sql
-- La consulta problemática (simplificada)
SELECT i.id, i.display_name, r.role_name
FROM identities i
LEFT JOIN role_assignments r ON i.id = r.identity_id
WHERE i.tenant_id = $1
  AND i.status = 'active'
ORDER BY i.last_seen DESC
LIMIT 100;
```

Sin un índice sobre `(tenant_id, status, last_seen)`, Postgres recorría secuencialmente 2.3 millones de filas y luego las ordenaba en memoria. El ordenamiento terminaba en disco, la memoria del pod crecía y el nodo comenzaba a usar swap.

## La corrección

Tres cambios, desplegados en secuencia:

**1. Agregar el índice compuesto faltante.**

```sql
CREATE INDEX CONCURRENTLY idx_identities_tenant_status_seen
ON identities (tenant_id, status, last_seen DESC);
```

El tiempo de consulta bajó de diez segundos a 200 ms inmediatamente.

**2. Ajustar el tamaño de los pods.** Los requests de memoria estaban en 2 GB porque «era lo que siempre usábamos». Medí durante una semana el consumo real y ajusté los valores:

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi    # antes 2Gi: sobreaprovisionado
  limits:
    cpu: "2"
    memory: 2Gi    # antes 4Gi: demasiado margen
```

Kubernetes pudo empacar los pods de forma más eficiente y evitar los nodos sobrecargados.

**3. Agregar un límite de tiempo a las consultas.** Cualquier consulta que supere tres segundos ahora se termina y devuelve un resultado parcial con una advertencia. Esto impide que una consulta defectuosa provoque una cascada.

```javascript
const QUERY_TIMEOUT_MS = 3000;

const result = await pool.query({
  text: queryText,
  values: params,
  statement_timeout: QUERY_TIMEOUT_MS,
});
```

## Los números

| Métrica | Antes | Después |
|---------|-------|---------|
| Latencia p95 | 10.2 s | 48 ms |
| Latencia p99 | 14.8 s | 112 ms |
| Memoria por pod | 3.2 GB | 680 MB |
| Costo mensual de infraestructura | ~USD 18k | ~USD 9.5k |

Solo el ajuste de pods ahorró cerca de USD 8,500 al mes al reducir el grupo de cinco nodos a tres. Anualizado, son más de USD 100,000 de ahorro de infraestructura a partir de una consulta cuyo diagnóstico tomó veinte minutos.

## Lo que aprendí

Los problemas de rendimiento casi nunca están donde esperas. La alerta decía «la API está lenta». El instinto decía «mal despliegue». La causa era un índice de base de datos ausente, expuesto por el volumen de un solo cliente y amplificado por la dinámica de memoria de Kubernetes.

La corrección no fue ingeniosa: un índice compuesto, requests de recursos menores y un timeout. Tres cambios aburridos. Encontrarlos exigió leer métricas en cada capa —aplicación, pod, nodo y base de datos— y seguir la evidencia en vez de las suposiciones.

El error de rendimiento más caro siempre es el que se esconde detrás de métricas «normales».
