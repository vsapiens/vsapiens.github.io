---
title: "Building for 300k TPS at a Y Combinator Startup"
description: "The story of scaling a small fintech app after getting into YC Summer 2021. Node.js on GCP, auto-scaling challenges, and the tradeoffs that come with startup engineering."
date: 2022-03-10
tags: ["startup", "backend", "gcp", "node-js", "scaling"]
---

## The Problem Nobody Warned Us About

When Kodda MX got into Y Combinator Summer 2021, we had roughly 2,000 daily active users and a single Node.js service running on a GCP Compute Engine instance. The kind of setup you draw on a napkin and ship in a weekend. It worked.

Then Demo Day happened, and within six weeks our projected transaction volume jumped from 5,000 TPS to a target of 300,000 TPS. Not because we had 300k users yet, but because a partnership deal with a large payment processor required us to prove we could handle their burst traffic before they would sign.

We had three months to make it happen.

## The Architecture We Started With

Our stack was straightforward: Express.js API, Cloud SQL (PostgreSQL), and a Redis cache layer. One service, one database, one region. Deployments were manual SSH-and-restart.

The first thing I did was run a baseline load test with Artillery. At 500 concurrent connections, p99 latency hit 4 seconds. At 1,000 connections, the service started dropping requests. We were nowhere close.

## What We Actually Did

**Step 1: Break the monolith into two services.** We separated the transaction processing pipeline from the user-facing API. This let us scale the hot path independently.

```yaml
# Cloud Run service config for the transaction processor
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

**Step 2: Move to Cloud Run with aggressive auto-scaling.** GCP Cloud Run gave us scale-to-zero plus the ability to burst to 200 instances. The key was tuning `containerConcurrency` -- too high and individual requests got slow, too low and we burned money spinning up instances.

**Step 3: Shard the database reads.** We added read replicas and routed all non-transactional queries there. For the transaction path, we moved the hot data into Redis and only wrote to Postgres asynchronously via Cloud Pub/Sub.

```javascript
// Pub/Sub async write -- the transaction confirms
// before the DB write completes
const publishResult = await pubsub
  .topic('tx-confirmed')
  .publishMessage({
    data: Buffer.from(JSON.stringify(transaction)),
  });

// Return 202 Accepted immediately
res.status(202).json({ txId: transaction.id, status: 'confirmed' });
```

**Step 4: Load test continuously.** Every PR ran a 60-second burst test in CI. If p95 latency regressed by more than 15%, the build failed. This caught three separate regressions before they hit production.

## The Result

After 11 weeks, we hit 312,000 TPS sustained over a 10-minute burst test, with p99 latency under 180ms. The partnership deal closed. Monthly infrastructure cost went from $400/month to $2,800/month at peak -- expensive for a startup, but the contract was worth 50x that.

## What I Took Away

Startup scaling is not the same as enterprise scaling. You don't have time to build the "right" system. You build the system that survives the next milestone. We made architectural decisions I would never make at a larger company -- async writes that could theoretically lose data in a catastrophic failure, aggressive caching that traded consistency for speed, manual failover procedures documented in a Google Doc.

But we shipped. And when you are three engineers trying to close a deal that keeps the company alive, shipping is the only metric that matters.

The napkin architecture got us to YC. The duct-tape architecture got us the contract. Sometimes that is exactly what good engineering looks like.
