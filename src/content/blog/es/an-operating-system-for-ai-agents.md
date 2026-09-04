---
title: "Un sistema operativo para agentes de IA"
description: "AgentOS coordina un organigrama de agentes con roles para llevar un producto desde un paquete de contexto hasta un MVP. Notas sobre su construcción y por qué los problemas interesantes son problemas de infraestructura."
date: 2026-08-05
tags: ["ia", "agentes", "typescript", "arquitectura", "llm"]
---

## La idea

Un solo agente de programación resulta impresionante hasta que la tarea crece. Entonces pierde el hilo: olvida una decisión tomada veinte pasos atrás, vuelve a discutir algo ya resuelto o se aleja del stack acordado.

La solución que sigue funcionándome no es un modelo más inteligente, sino más estructura. AgentOS es mi intento de darles un organigrama a los agentes: 22 roles distribuidos entre producto, ingeniería y crecimiento, cada uno con un contrato estrecho y coordinados mediante flujos declarativos en vez de un prompt gigantesco.

Le entregas un paquete de contexto. El sistema ejecuta una cadena de agentes para convertir esa idea en un MVP.

## Los flujos son archivos, no prompts

La decisión central es que un flujo de trabajo sea un **artefacto declarativo** —Markdown y YAML guardados en el repositorio— y no una conversación. Una cadena `product-launch` o un `weekly-growth-loop` es un archivo que puedes leer, comparar y revisar en un pull request.

Eso vuelve al sistema *inspeccionable*. Cuando un agente hace algo inesperado, no releo una transcripción para reconstruir lo ocurrido. Leo el flujo que le indicó qué hacer. El comportamiento vive en control de versiones, junto al código que produce.

## Los problemas aburridos son los problemas reales

Esto fue lo que no esperaba: casi ninguno de los problemas difíciles es un problema de IA.

- **Aislamiento.** Cuando varios agentes trabajan en paralelo, pisan los archivos de los demás. La solución es vieja y poco glamorosa: git worktrees, uno por worker, para que cada agente tenga su propio checkout y los cambios puedan integrarse limpiamente.
- **Aplicación de reglas.** Los agentes tomarán otro framework, saltarán una prueba o abrirán un hueco de seguridad con tal de cerrar un ticket. Por eso el stack estándar y los no negociables de seguridad viven en los gates del pull request. El agente no puede atravesarlos más de lo que podría una persona.
- **Observabilidad.** No puedes depurar lo que no ves. Todo se traza con OpenTelemetry, porque «el agente hizo algo raro» no es un reporte de error sobre el que pueda actuar.

Aislamiento, aplicación de reglas y observabilidad. No es una lista de deseos para IA: es la misma lista de sistemas distribuidos que usaría con cualquier flota de workers que comparte estado. Los agentes solo son workers con peor control de impulsos.

## En qué punto está

AgentOS está en su orquestador v2 y en desarrollo activo, con un demo beta público. Es el proyecto que conecta más directamente las dos mitades de mi trabajo: el instinto de ingeniería de rendimiento para construir sistemas que conserven su corrección bajo carga, aplicado a una flota de agentes de IA en vez de una flota de pods.

El modelo se queda con los titulares. La infraestructura que lo rodea decide si realmente entrega algo.
