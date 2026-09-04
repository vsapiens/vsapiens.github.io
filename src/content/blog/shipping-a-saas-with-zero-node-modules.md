---
title: "Shipping a SaaS With Zero node_modules"
description: "What I learned building Vitrina — a WhatsApp-native website generator for local Mexican businesses — on a hand-written, zero-dependency Node backend, and why Meta nearly killed it overnight."
date: 2026-08-18
tags: ["node-js", "saas", "llm", "indie-hacking", "architecture"]
---

## The pitch

Most local businesses in Mexico don't have a website. They have an Instagram, a WhatsApp number, and a pin on Google Maps. Vitrina's bet is that those three things are already a website — it just hasn't been assembled yet.

So the product is simple to describe: a business messages a WhatsApp number, answers a few questions, and gets back a live, single-file website that pulls together its Instagram photos and Google Maps location. The first 24 hours are free. After that, it's a Stripe subscription.

The interesting part isn't the pitch. It's the constraint I gave myself: **no runtime dependencies.**

## Zero node_modules, on purpose

Vitrina's API has an empty `node_modules` in production. No Express, no ORM, no SMTP library. The HTTP router, the template engine, the auth layer, and even the email client are hand-written against Node's standard library.

That sounds masochistic, and some days it was. But it bought three things I care about a lot:

- **Auditability.** When a platform can suspend your account for what your code does, "I can read every line that runs" stops being a purist flex and becomes a risk control.
- **A tiny attack surface.** There's no transitive dependency to get a CVE at 2 a.m.
- **Cold starts that are actually cold.** The whole thing boots in milliseconds because there's nothing to load.

The tradeoff is real: I wrote an SMTP client instead of `npm install nodemailer`. But the codebase stayed small enough that one person can hold all of it in their head, and for a solo product that's the whole game.

## The research pipeline

Generating a decent site from a business name is where the LLMs come in — but you can't just hand a model a URL and hope. Vitrina runs a layered pipeline: a cheap, safe `fetch` pass first, and only if that's not enough does it escalate to a Playwright browser that can render the real page.

Every step that spends money — a browser session, an LLM call, an image generation — runs under a **per-demo USD budget cap**. A single free demo can never cost more than a fixed number of cents, no matter how the model behaves. The budget lives in code, not in a dashboard I might forget to check.

Expired demos don't get deleted, either. They go into a cold archive and can be reactivated at essentially zero idle cost, so a business that comes back a month later still finds its page.

## Where it broke

Here's the part indie-hacking write-ups usually skip.

The whole funnel was designed around the WhatsApp Cloud API. In July, Meta disabled Vitrina's production WhatsApp Business account and rejected the appeal. The production channel is paused; the public site remains available.

That is the risk of building on someone else's platform, and no amount of clean architecture protects you from it. The zero-dependency backend still boots and `vitrinamx.mx` still serves. But the front door — the thing that made it magic, a business getting a website from a text message — is the one piece I don't control.

## What I'd tell myself

Build the core so you can trust it completely. Then assume the platform layer on top can be taken away without warning, and design the day-one plan for getting it back. I did the first part well. I'm still learning the second.

Vitrina's public site remains available while I work on the paused production WhatsApp channel. The engineering underneath it is some of the work I'm proudest of.
