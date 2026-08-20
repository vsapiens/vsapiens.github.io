---
title: "An Operating System for AI Agents"
description: "AgentOS runs a full org chart of role-based AI agents to take a product from a context pack to a deployed MVP. Notes from building it — and why the interesting problems are boring infrastructure problems."
date: 2026-08-05
tags: ["ai", "agents", "typescript", "architecture", "llm"]
---

## The idea

A single coding agent is impressive right up until the task gets big. Then it loses the thread — forgets a decision from twenty steps ago, re-litigates something already settled, drifts off the stack you agreed on.

The fix that keeps working for me isn't a smarter model. It's structure. AgentOS is my attempt to give agents an org chart: 22 role-based agents across departments — product, engineering, growth — each with a narrow contract, coordinated by declarative workflows instead of one giant prompt.

You hand it a context pack. It runs a chain of agents to take that from idea to a deployed MVP.

## Workflows are files, not prompts

The core decision is that a workflow is a **declarative artifact** — Markdown and YAML checked into the repo — not a conversation. A `product-launch` chain or a `weekly-growth-loop` is a file you can read, diff, and review in a PR.

That matters because it makes the system *inspectable*. When an agent does something surprising, I don't re-read a transcript trying to reconstruct what happened. I read the workflow that told it what to do. The behavior lives in version control, next to the code it produces.

## The boring problems are the real ones

Here's what I didn't expect: almost none of the hard problems are AI problems.

- **Isolation.** When several agents work in parallel, they stomp on each other's files. The fix is old and unglamorous — git worktrees, one per worker — so parallel agents each get their own checkout and merge cleanly.
- **Enforcement.** Agents will happily reach for a different framework, skip a test, or ship a security hole to close a ticket. So the standard stack and the security non-negotiables are baked into PR gates. The agent can't merge past them any more than a human could.
- **Observability.** You cannot debug what you cannot see. Everything is traced with OpenTelemetry, because "the agent did something weird" is not a bug report I can act on.

Isolation, enforcement, observability. That's not an AI wishlist — it's the same distributed-systems checklist I'd bring to any fleet of workers that share state. Agents are just workers with worse impulse control.

## Where it is

AgentOS is on its v2 orchestrator, in active development, with a public beta demo. It's the project that most directly connects the two halves of what I do: the performance-engineering instinct for systems that stay correct under load, pointed at a fleet of AI agents instead of a fleet of pods.

The model gets the headlines. The infrastructure around it decides whether it actually ships.
