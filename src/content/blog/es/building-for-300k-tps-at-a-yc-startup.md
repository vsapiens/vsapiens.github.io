---
title: "Construir para 300k TPS en una startup de Y Combinator"
description: "La historia de escalar una aplicación fintech después de entrar a YC Summer 2021: Node.js sobre GCP, retos de autoscaling y los intercambios de la ingeniería de startup."
date: 2022-03-10
tags: ["startup", "backend", "gcp", "node-js", "escalamiento"]
---

## El problema del que nadie nos advirtió

Cuando Kodda MX entró a Y Combinator Summer 2021, teníamos cerca de 2,000 usuarios activos diarios y un solo servicio Node.js en una instancia de Compute Engine de GCP. El tipo de configuración que dibujas en una servilleta y publicas en un fin de semana. Funcionaba.

Después llegó Demo Day y, en seis semanas, el volumen proyectado pasó de 5,000 TPS a un objetivo de 300,000 TPS. No porque ya tuviéramos 300,000 usuarios, sino porque una alianza con un gran procesador de pagos exigía demostrar que soportaríamos su tráfico en ráfagas antes de firmar.

Teníamos tres meses.

## La arquitectura inicial

El stack era directo: API Express.js, Cloud SQL con PostgreSQL y una capa de caché Redis. Un servicio, una base de datos, una región. Los despliegues se hacían manualmente por SSH y reinicio.

Lo primero fue una prueba base con Artillery. Con 500 conexiones concurrentes, p99 alcanzó cuatro segundos. Con 1,000, el servicio comenzó a descartar peticiones. Estábamos muy lejos.

## Lo que hicimos

**Paso 1: dividir el monolito en dos servicios.** Separamos el pipeline de transacciones de la API para usuarios. Así pudimos escalar la ruta caliente de forma independiente.

```yaml
# Configuración de Cloud Run para el procesador de transacciones
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: tx-processor
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "200"
        autoscaling.knative.dev/target: "80"
    spec:
      containerConcurrency: 50
      containers:
        - image: gcr.io/kodda-prod/tx-processor:latest
          resources:
            limits:
              cpu: "2"
              memory: 1Gi
```

**Paso 2: migrar a Cloud Run con autoscaling agresivo.** Cloud Run ofrecía scale-to-zero y la posibilidad de llegar a 200 instancias. La clave fue ajustar `containerConcurrency`: demasiado alto volvía lenta cada petición; demasiado bajo gastaba dinero iniciando instancias.

**Paso 3: separar las lecturas de base de datos.** Agregamos réplicas y enviamos ahí las consultas no transaccionales. Para la ruta de transacciones, llevamos datos calientes a Redis y escribimos a Postgres de forma asíncrona mediante Cloud Pub/Sub.

```javascript
// Escritura asíncrona con Pub/Sub: la transacción se confirma
// antes de completar la escritura en base de datos
const publishResult = await pubsub
  .topic('tx-confirmed')
  .publishMessage({
    data: Buffer.from(JSON.stringify(transaction)),
  });

// Devolver 202 Accepted de inmediato
res.status(202).json({ txId: transaction.id, status: 'confirmed' });
```

**Paso 4: probar carga continuamente.** Cada pull request ejecutaba una ráfaga de 60 segundos. Si p95 empeoraba más de 15%, el build fallaba. Esto detectó tres regresiones antes de producción.

## El resultado

Después de 11 semanas alcanzamos 312,000 TPS sostenidos durante una ráfaga de diez minutos, con p99 por debajo de 180 ms. La alianza se cerró. El costo mensual pasó de USD 400 a USD 2,800 durante el pico; caro para una startup, pero el contrato valía cincuenta veces más.

## Lo que aprendí

Escalar una startup no es lo mismo que escalar una empresa grande. No hay tiempo para construir el sistema «correcto». Construyes el sistema que sobrevive el siguiente hito. Tomamos decisiones que no elegiría en una organización mayor: escrituras asíncronas que teóricamente podían perder datos ante una falla catastrófica, caché agresivo que intercambiaba consistencia por velocidad y failover manual documentado en Google Docs.

Pero entregamos. Cuando tres ingenieros intentan cerrar el acuerdo que mantiene viva a la empresa, entregar es la métrica que importa.

La arquitectura de servilleta nos llevó a YC. La arquitectura sostenida con cinta nos dio el contrato. A veces eso es exactamente lo que significa hacer buena ingeniería.
