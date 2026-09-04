---
title: "Generar pruebas de carga desde OpenAPI con LLM"
description: "k6gen convierte una especificación OpenAPI en pruebas k6 ejecutables mediante un núcleo determinista y una pasada de LLM muy acotada. Por qué la parte aburrida importa más que la IA."
date: 2026-06-10
tags: ["rendimiento", "k6", "llm", "pruebas-de-carga", "observabilidad"]
---

## El vacío que seguía encontrando

Escribir pruebas de carga es la parte menos glamorosa de la ingeniería de rendimiento y, por eso, es la parte que suele omitirse. Un equipo publica una API con una especificación OpenAPI limpia, pero nunca escribe los scripts de k6 que realmente la ejercitan; o los escribe una vez, a mano, y se descomponen cuando cambia un endpoint.

La especificación ya describe cada ruta, método, parámetro y esquema. La prueba de carga es, en gran medida, una transformación mecánica de esa información. Por eso construí `k6gen`.

## Núcleo determinista, borde de LLM acotado

La tentación con una herramienta así es entregar toda la especificación a un modelo y pedirle un script de k6. No lo hagas. La salida de un LLM no es determinista, y una prueba de carga que no puedes reproducir es peor que no tenerla: terminarás persiguiendo regresiones fantasma.

k6gen divide el trabajo:

- **Un núcleo determinista** analiza la especificación y emite el esqueleto: endpoints correctos, cuerpos válidos derivados de los esquemas, autenticación adecuada y umbrales iniciales razonables. La misma especificación produce exactamente el mismo script, byte por byte, cada vez.
- **Una pasada acotada de LLM** completa únicamente lo que la especificación no puede expresar: valores realistas, una mezcla razonable de lecturas y escrituras, y secuencias correlacionadas que se parezcan a una sesión real en vez de fuzzing aleatorio.

El modelo vuelve *realista* a la prueba. El núcleo la vuelve *reproducible*. Necesitas ambos, y mantenerlos separados es la decisión de diseño más importante.

## Hacer legibles los resultados

Una prueba que produce una pared de números que nadie lee es una prueba fallida. k6gen se acompaña de un stack de observabilidad —k6 conectado a Prometheus y dashboards de Grafana preconfigurados— para que, al terminar una ejecución, veas percentiles de latencia y tasas de error en una gráfica en vez de desplazarte por la terminal.

Funciona como CLI empaquetada y como GitHub Action, así que su hogar natural es CI: cada pull request puede regenerar las pruebas desde la especificación actual y fallar si la latencia p95 supera un umbral. Es el patrón que he usado durante años para detectar regresiones antes de producción; k6gen simplemente elimina la excusa para no configurarlo.

## El ángulo del LLM que nadie espera

La misma técnica se generaliza. La he aplicado a la inferencia de LLM: benchmarks de tiempo hasta el primer token, latencia entre tokens y tokens por segundo bajo modelos de carga abiertos. Probar la carga de un LLM sigue siendo probar carga; las métricas pasan de «peticiones por segundo» a «tokens por segundo», pero la disciplina de observabilidad es idéntica.

La ingeniería de rendimiento no perdió relevancia cuando todo el mundo comenzó a lanzar IA. Si acaso, la inferencia es el salto más costoso y sensible a latencia del stack moderno. Alguien tiene que medirlo.

k6gen es código abierto. El núcleo aburrido y determinista es la parte que más orgullo me da.
