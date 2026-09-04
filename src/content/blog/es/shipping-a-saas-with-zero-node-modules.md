---
title: "Entregar un SaaS sin node_modules"
description: "Lo que aprendí construyendo Vitrina, un generador de sitios desde WhatsApp para negocios mexicanos, sobre un backend Node escrito a mano y sin dependencias; y cómo Meta casi lo detuvo de un día para otro."
date: 2026-08-18
tags: ["node-js", "saas", "llm", "indie-hacking", "arquitectura"]
---

## La propuesta

Muchos negocios locales en México no tienen sitio web. Tienen Instagram, un número de WhatsApp y un pin en Google Maps. La apuesta de Vitrina es que esas tres cosas ya son un sitio web; solo falta ensamblarlo.

El producto es fácil de explicar: un negocio escribe a un número de WhatsApp, responde algunas preguntas y recibe un sitio activo de un solo archivo que reúne sus fotos de Instagram y su ubicación de Google Maps. Las primeras 24 horas son gratuitas. Después, continúa con una suscripción de Stripe.

La parte interesante no es la propuesta, sino la restricción que me impuse: **cero dependencias en runtime**.

## Cero node_modules, a propósito

La API de Vitrina tiene un `node_modules` vacío en producción. No usa Express, ORM ni biblioteca de SMTP. El router HTTP, el motor de plantillas, la capa de autenticación e incluso el cliente de correo están escritos sobre la biblioteca estándar de Node.

Suena masoquista y algunos días lo fue. Pero me dio tres cosas que valoro mucho:

- **Capacidad de auditoría.** Cuando una plataforma puede suspender tu cuenta por lo que hace tu código, «puedo leer cada línea que se ejecuta» deja de ser una postura purista y se convierte en un control de riesgo.
- **Una superficie de ataque pequeña.** No existe una dependencia transitiva que reciba un CVE a las dos de la mañana.
- **Arranques en frío que realmente son fríos.** Todo inicia en milisegundos porque no hay nada adicional que cargar.

El intercambio es real: escribí un cliente SMTP en vez de ejecutar `npm install nodemailer`. Sin embargo, el código se mantuvo lo bastante pequeño para que una persona pudiera entenderlo completo, y en un producto individual eso cambia el juego.

## El pipeline de investigación

Generar un sitio decente a partir del nombre de un negocio es donde entran los LLM, pero no basta con darle una URL a un modelo y esperar. Vitrina ejecuta un pipeline por capas: primero un `fetch` económico y seguro; solo cuando no alcanza, escala a un navegador Playwright capaz de renderizar la página real.

Cada paso que cuesta dinero —una sesión de navegador, una llamada al LLM o una generación de imagen— opera bajo un **tope en USD por demo**. Un demo gratuito nunca puede costar más de una cantidad fija de centavos, sin importar cómo se comporte el modelo. El límite vive en código, no en un dashboard que podría olvidar revisar.

Los demos vencidos tampoco se borran. Pasan a un archivo en frío y pueden reactivarse con un costo inactivo prácticamente nulo. Si un negocio vuelve un mes después, su página sigue ahí.

## Dónde se rompió

Esta es la parte que suelen omitir los textos de indie hacking.

Todo el embudo fue diseñado alrededor de WhatsApp Cloud API. En julio, Meta deshabilitó la cuenta de WhatsApp Business de producción de Vitrina y rechazó la apelación. El canal de producción está pausado; el sitio público permanece disponible.

Ese es el riesgo de construir sobre la plataforma de otra empresa, y ninguna arquitectura limpia puede eliminarlo. El backend sin dependencias todavía inicia y `vitrinamx.mx` todavía responde. Pero la puerta de entrada —la magia de que un negocio obtuviera un sitio con un mensaje— es justamente la parte que no controlo.

## Lo que me diría a mí mismo

Construye el núcleo para poder confiar por completo en él. Después, asume que la capa de plataforma puede desaparecer sin aviso y diseña desde el primer día un plan para recuperarla. Hice bien la primera parte. Sigo aprendiendo la segunda.

El sitio público de Vitrina permanece disponible mientras trabajo en el canal de WhatsApp de producción pausado. La ingeniería que sostiene al producto es parte del trabajo del que más orgullo siento.
