---
title: "Generating Load Tests From OpenAPI With LLMs"
description: "k6gen turns an OpenAPI spec into runnable k6 load tests using a deterministic core and a tightly-constrained LLM pass. Here's why the boring part matters more than the AI."
date: 2026-06-10
tags: ["performance", "k6", "llm", "load-testing", "observability"]
---

## The gap I kept hitting

Writing load tests is the least glamorous part of performance engineering, so it's the part that gets skipped. A team ships an API with a clean OpenAPI spec, and the k6 scripts to actually exercise it never get written — or they get written once, by hand, and rot the moment an endpoint changes.

The spec already describes every path, method, parameter, and schema. The load test is, mostly, a mechanical transformation of that. So I built `k6gen` to do the transformation.

## Deterministic core, constrained LLM edge

The temptation with a tool like this is to throw the whole spec at a model and ask for a k6 script. Don't. LLM output is non-deterministic, and a load test you can't reproduce is worse than no load test — you'll chase phantom regressions forever.

So k6gen splits the work:

- **A deterministic core** parses the OpenAPI spec and emits the skeleton: the right endpoints, valid request bodies derived from the schemas, correct auth wiring, sane default thresholds. Same spec in, byte-identical script out, every time.
- **A constrained LLM pass** only fills the gaps the spec can't express — realistic parameter values, a sensible mix of read/write traffic, correlated request sequences that look like a real user session instead of random fuzzing.

The model makes the test *realistic*. The core makes it *reproducible*. You need both, and keeping them separate is the whole design.

## Making the results legible

A load test that produces a wall of numbers nobody reads is a failed load test. k6gen ships alongside an observability stack — k6 wired into Prometheus with pre-provisioned Grafana dashboards — so the moment a run finishes, you're looking at latency percentiles and error rates in a chart, not scrolling a terminal.

It runs as a packaged CLI and as a GitHub Action, so the natural home is CI: every PR can regenerate its load tests from the current spec and fail the build if p95 latency regresses past a threshold. That's the pattern I've used to catch performance regressions before they reach production for years — k6gen just removes the excuse not to set it up.

## The LLM angle nobody expects

The same technique generalizes. I've been applying it to LLM inference itself — benchmarking endpoints for time-to-first-token, inter-token latency, and tokens-per-second under open workload models. Load testing an LLM is still load testing; the metrics just move from "requests per second" to "tokens per second," and the observability discipline is identical.

Performance engineering didn't get less relevant when everyone started shipping AI. If anything, inference is the most expensive, most latency-sensitive hop in the modern stack. Someone has to measure it.

k6gen is open source. The boring, deterministic core is the part I'm proudest of.
