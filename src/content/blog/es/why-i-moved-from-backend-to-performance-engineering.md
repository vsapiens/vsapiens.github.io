---
title: "Por qué pasé de backend a ingeniería de rendimiento"
description: "La trayectoria desde backend en una startup hasta Lead Performance Engineer: qué es realmente la ingeniería de rendimiento, por qué importa y cómo hacer la transición."
date: 2026-02-12
tags: ["carrera", "rendimiento", "cultura-de-ingeniería", "crecimiento"]
---

## La pregunta que sigo escuchando

«¿Por qué ingeniería de rendimiento? ¿No es solo ejecutar pruebas de carga?»

He escuchado esto de ingenieros backend, managers y reclutadores. Es una pregunta justa. Desde afuera, rendimiento parece un nicho: una función de apoyo que ejecuta scripts y produce reportes. Desde dentro, es la disciplina que se coloca en la intersección de cada capa del stack y pregunta: «¿esto funcionará realmente cuando importe?».

Pasé cinco años como ingeniero backend. Construí APIs, diseñé bases de datos y entregué features. Después hice un cambio deliberado hacia rendimiento. Esta es la razón.

## La startup que cambió mi perspectiva

En Kodda MX era uno de tres ingenieros backend de una plataforma fintech. Cuando necesitábamos escalar hacia un objetivo de 300,000 transacciones por segundo para una alianza, no había un equipo de rendimiento al que llamar. Yo ejecutaba pruebas de madrugada, perfilaba heaps de Node.js y ajustaba parámetros de autoscaling de Cloud Run.

Esa experiencia plantó la semilla. Entendí que los problemas más difíciles que resolvía no eran de features, sino de rendimiento. Las habilidades también eran distintas: conocimiento profundo de sistemas, comodidad con la ambigüedad y capacidad para leer métricas de cinco herramientas y sintetizar un diagnóstico.

En Globant profundicé. Fui responsable de la estrategia de carga para una plataforma de subastas y diseñé suites k6 que simulaban ráfagas de 100,000 RPS. Mi título todavía decía «backend», pero 70% de mi trabajo ya estaba relacionado con rendimiento. El título aún no alcanzaba a la realidad.

## Hacer el cambio

Entré a SailPoint como Performance Engineer, mi primer rol oficial con el título. El trabajo fue inmediatamente más amplio de lo que esperaba.

En un trimestre:

- Diagnostiqué una regresión de latencia de 200x causada por un índice faltante y la dinámica de memoria de Kubernetes.
- Construí una capa de observabilidad con CloudWatch que redujo el tiempo de indisponibilidad durante incidentes.
- Realicé ejercicios de capacidad que ajustaron un clúster y documentaron un ahorro anual de infraestructura.
- Escribí suites k6 integradas a pipelines de CI/CD.

Nada de esto era «solo ejecutar pruebas». Era depuración, revisión de arquitectura, análisis de datos, optimización de infraestructura y educación de equipos, todo bajo la pregunta: «¿cómo se comporta el sistema en condiciones reales?».

El paso a EPAM como Lead Performance Engineer fue natural. Ahora trabajo en distintos sistemas y llevo prácticas de rendimiento a equipos que las necesitan. Algunos nunca han ejecutado una prueba de carga. Otros tienen CI/CD maduro pero ningún gate de rendimiento. Cada caso cambia, pero el núcleo se mantiene: comprender el sistema, medirlo con honestidad y corregir lo que importa.

## Qué es realmente la ingeniería de rendimiento

No es una disciplina de testing. Es una disciplina de ingeniería que usa testing como una herramienta entre varias.

Así la entiendo:

- **Pruebas de carga** indican dónde se rompe el sistema. Son la parte visible, pero quizá representan 30% del trabajo.
- **Perfilado y diagnóstico** explican por qué se rompe. Aquí aparecen flame graphs, planes de consulta, heap dumps y trazas distribuidas.
- **Planeación de capacidad** indica cuándo se romperá. Modelas crecimiento, pronosticas recursos y propones escalamiento antes de que llegue el problema.
- **Observabilidad** muestra si se está rompiendo ahora. Construyes dashboards, alertas y logging que vuelven visible el rendimiento para todo el equipo.
- **Cultura** vuelve sostenible lo anterior. Integras checks a CI/CD, agregas presupuestos de latencia a los SLO y enseñas a tratar rendimiento como una característica.

## Consejos para hacer la transición

Si trabajas en backend y consideras esta especialidad, esto te diría:

**Comienza con los problemas que ya tienes.** Todo equipo ignora algún problema de rendimiento. Ofrécete para investigar el endpoint lento, montar la primera prueba o construir el dashboard faltante. No necesitas un cambio de título para comenzar.

**Aprende las herramientas.** k6 o Gatling para carga; Grafana, Datadog o New Relic para observabilidad; `async-profiler` o Chrome DevTools para perfilado; `EXPLAIN ANALYZE` para consultas. No necesitas dominarlas todas, pero sí sentirte cómodo con al menos una por categoría.

**Acostúmbrate a no saber.** Backend suele ofrecer un camino claro: aquí está el ticket, construye la feature, escribe pruebas. Rendimiento es más desordenado. El síntoma es «está lento» y la causa puede vivir en cualquier parte. Necesitas disfrutar ese trabajo detectivesco.

**Piensa en sistemas, no en servicios.** Un ingeniero backend suele ser responsable de un servicio. Rendimiento es responsable del comportamiento de la ruta completa, desde el balanceador hasta la base de datos y de regreso. Hay que sentir curiosidad por todas las capas, incluso las que no son «tuyas».

## Por qué importa

El software se vuelve más complejo, no menos. Microservicios, serverless, edge e inferencia de IA agregan nuevas formas de volverse lento, poco confiable o caro bajo carga. La demanda de personas capaces de hacer que estos sistemas funcionen a escala seguirá creciendo.

No dejé backend por aburrimiento. Cambié porque rendimiento me permitió trabajar en problemas más difíciles, atravesar más capas y generar un efecto más directo en costos y experiencia. Cada optimización ahorra dinero o mejora la experiencia. Normalmente hace ambas cosas.

Si te interesa, deja de esperar el título. Comienza a hacer el trabajo. La carrera lo sigue.
