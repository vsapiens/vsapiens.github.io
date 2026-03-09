---
title: "Why I Moved from Backend Engineering to Performance Engineering"
description: "The career arc from backend developer at a startup to Lead Performance Engineer at EPAM. What performance engineering really is, why it matters, and practical advice for making the pivot."
date: 2026-02-12
tags: ["career", "performance", "engineering-culture", "growth"]
---

## The Question I Keep Getting

"Why performance engineering? Isn't that just... running load tests?"

I have heard this from backend engineers, engineering managers, even recruiters. It is a fair question. From the outside, performance engineering looks like a niche -- a support function that runs scripts and produces reports. From the inside, it is the discipline that sits at the intersection of every layer of the stack and asks: "Is this actually going to work when it matters?"

I spent five years as a backend engineer. I built APIs, designed databases, shipped features. And then I made a deliberate move into performance engineering. Here is why.

## The Startup That Changed My Perspective

At Kodda MX, I was one of three backend engineers building a fintech platform. When we needed to scale to 300,000 transactions per second for a partnership deal, there was no performance team to call. I was the one running load tests at midnight, profiling Node.js heap snapshots, and tuning Cloud Run autoscaling parameters.

That experience planted the seed. I realized that the hardest problems I solved were not feature problems -- they were performance problems. And the skills required were different: deep systems knowledge, comfort with ambiguity, the ability to read metrics from five different tools and synthesize a diagnosis.

At Globant, I leaned into it further. I owned the load testing strategy for a dealer auction platform, designing k6 test suites that simulated 100,000 RPS auction bursts. I was technically still a "backend engineer," but 70% of my work was performance-related. The title had not caught up to the reality.

## Making the Pivot

When I joined SailPoint, it was as a Performance Engineer -- my first official role with the title. The work was immediately broader than I expected.

In a single quarter, I:

- Diagnosed a 200x latency regression caused by a missing database index and Kubernetes memory dynamics
- Built a CloudWatch observability stack that reduced incident downtime by 40%
- Ran capacity planning exercises that right-sized a cluster and saved $100k annually
- Wrote k6 performance test suites integrated into CI/CD pipelines

None of this was "just running load tests." It was debugging, architecture review, data analysis, infrastructure optimization, and developer education -- all through the lens of "how does this system behave under real conditions?"

Moving to EPAM as a Lead Performance Engineer was the natural next step. Now I work across client engagements, bringing performance practices to teams that need them. Some teams have never run a load test. Others have mature CI/CD but no performance gates. The work is different every time, but the core is always the same: understand the system, measure it honestly, and fix what matters.

## What Performance Engineering Actually Is

Performance engineering is not a testing discipline. It is an engineering discipline that uses testing as one of many tools.

Here is how I think about it:

- **Load testing** tells you where the system breaks. It is the most visible part of the job, but it is maybe 30% of the work.
- **Profiling and diagnostics** tell you why the system breaks. This is where you live in flame graphs, query plans, heap dumps, and distributed traces.
- **Capacity planning** tells you when the system will break. You model growth, forecast resource needs, and recommend scaling strategies before the problem arrives.
- **Observability** tells you if the system is breaking right now. You build the dashboards, alerts, and logging that make performance visible to the entire team.
- **Culture** makes all of the above sustainable. You embed performance checks in CI/CD, add latency budgets to SLOs, and teach developers to think about performance as a feature, not an afterthought.

## Advice for the Pivot

If you are a backend engineer thinking about performance engineering, here is what I would tell you:

**Start with the problems you already have.** Every team has performance issues they are ignoring. Volunteer to investigate the slow endpoint, set up the first load test, build the missing dashboard. You do not need a title change to start doing the work.

**Learn the tools.** k6 or Gatling for load testing. Grafana, Datadog, or New Relic for observability. `async-profiler` or Chrome DevTools for profiling. `EXPLAIN ANALYZE` for database queries. You do not need all of them, but you need to be comfortable with at least one in each category.

**Get comfortable with not knowing.** Backend engineering gives you a clear path: here is the ticket, build the feature, write the tests. Performance engineering is messier. The symptom is "it's slow." The cause could be anywhere. You need to enjoy that detective work.

**Think in systems, not services.** A backend engineer owns a service. A performance engineer owns the behavior of the entire request path -- from the load balancer to the database and back. You need to be curious about every layer, even the ones that are not "yours."

## Why It Matters

Software is getting more complex, not less. Microservices, serverless, edge computing, AI inference pipelines -- every architectural trend adds more ways for systems to be slow, unreliable, or expensive under load. The demand for engineers who can make these systems actually work at scale is only growing.

I did not leave backend engineering because I was bored. I left because performance engineering let me work on harder problems, across more of the stack, with more direct impact on the bottom line. Every optimization I ship either saves money or makes users happier. Usually both.

If that sounds interesting to you, stop waiting for the title. Start doing the work. The career follows.
