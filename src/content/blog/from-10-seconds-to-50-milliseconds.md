---
title: "From 10 Seconds to 50 Milliseconds: A Performance Optimization Story"
description: "Diagnosing a 200x latency regression in Kubernetes on AWS. The investigation, the fix, and how it saved $100k in annual infrastructure costs."
date: 2025-04-15
tags: ["performance", "kubernetes", "aws", "k6", "optimization"]
---

## The Alert That Ruined a Friday

At 3:47 PM on a Friday, our Datadog alert fired: p95 latency on the identity resolution API had crossed 8 seconds. Normal baseline was around 400ms. By the time I pulled up the dashboard, it was averaging 10.2 seconds. Users were timing out. Support tickets were piling up.

This was at SailPoint, on a service that powered real-time identity governance lookups. When it was slow, enterprise customers could not provision or deprovision access. For a security product, that is not just a performance problem -- it is a compliance risk.

## The Investigation

The first instinct was to blame the deployment. We had shipped a release that morning. But rolling back did not fix it. Latency stayed at 10 seconds. That ruled out application code.

Next, I checked the Kubernetes cluster. The pods were running, health checks passing, no restarts. CPU and memory looked normal at the pod level. But when I looked at node-level metrics, something stood out: one of the three nodes in the node group was running at 94% memory utilization while the others sat at 45%.

```bash
# The command that cracked it open
kubectl top pods -n identity --sort-by=memory
```

One pod was consuming 3.2GB of memory against a 2GB request and a 4GB limit. Kubernetes was not killing it (under the limit), but the node was swapping. And when a node swaps, every pod on that node suffers.

## The Root Cause

It was a query. A single database query in the identity resolution path had been fine when the average customer had 50,000 identities. But one enterprise customer had just onboarded with 2.3 million identities, and the query was doing an unindexed join across their full dataset.

```sql
-- The offending query (simplified)
SELECT i.id, i.display_name, r.role_name
FROM identities i
LEFT JOIN role_assignments r ON i.id = r.identity_id
WHERE i.tenant_id = $1
  AND i.status = 'active'
ORDER BY i.last_seen DESC
LIMIT 100;
```

Without an index on `(tenant_id, status, last_seen)`, Postgres was doing a sequential scan across 2.3 million rows, then sorting in memory. The sort spilled to disk, the pod's memory ballooned, and the node started swapping.

## The Fix

Three changes, deployed in sequence:

**1. Add the missing composite index.**

```sql
CREATE INDEX CONCURRENTLY idx_identities_tenant_status_seen
ON identities (tenant_id, status, last_seen DESC);
```

Query time dropped from 10 seconds to 200ms immediately.

**2. Right-size the pods.** The memory requests were set to 2GB because "that is what we always used." I profiled actual memory usage across all pods for a week and adjusted:

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi    # was 2Gi -- over-provisioned
  limits:
    cpu: "2"
    memory: 2Gi    # was 4Gi -- too much headroom
```

This let Kubernetes pack pods more efficiently and schedule away from overloaded nodes.

**3. Add a query timeout guard.** Any query running longer than 3 seconds now gets killed and returns a partial result with a warning header. This prevents one bad query from cascading.

```javascript
const QUERY_TIMEOUT_MS = 3000;

const result = await pool.query({
  text: queryText,
  values: params,
  statement_timeout: QUERY_TIMEOUT_MS,
});
```

## The Numbers

| Metric | Before | After |
|--------|--------|-------|
| p95 latency | 10.2s | 48ms |
| p99 latency | 14.8s | 112ms |
| Pod memory usage | 3.2GB | 680MB |
| Monthly infra cost | ~$18k | ~$9.5k |

The pod right-sizing alone saved roughly $8,500/month by reducing the node group from 5 nodes to 3. Annualized, that is over $100,000 in infrastructure savings from a query that took 20 minutes to diagnose.

## What This Taught Me

Performance problems are almost never where you think they are. The alert said "API is slow." The instinct said "bad deployment." The truth was a missing database index exposed by a single customer's data volume, amplified by Kubernetes memory dynamics.

The fix was not clever. A composite index, smaller resource requests, and a timeout. Three boring changes. But finding them required reading metrics at every layer -- application, pod, node, database -- and following the evidence instead of assumptions.

The most expensive performance bug is always the one hiding behind "normal" metrics.
