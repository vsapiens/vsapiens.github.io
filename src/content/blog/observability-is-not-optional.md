---
title: "Observability Is Not Optional: How Monitoring Saved Us 40% Downtime"
description: "How building CloudWatch dashboards, S3 log exports, and automated alerting at SailPoint transformed incident response from blind firefighting to proactive resolution."
date: 2025-09-05
tags: ["observability", "aws", "cloudwatch", "monitoring", "devops"]
---

## Flying Blind

When I joined the performance engineering team at SailPoint, the identity governance platform had monitoring in the way most teams have monitoring: it existed, technically. There was a CloudWatch dashboard someone had built a year ago. There were a few alarms that fired so often everyone had muted the Slack channel. And when something went wrong, the debugging process was: SSH into the box, grep the logs, hope the relevant lines had not rotated out.

Average time to identify root cause during an incident: 47 minutes. Average incident duration: 1 hour 52 minutes. We were spending roughly 14 hours per month on incidents, and half that time was just figuring out what broke.

I was brought in to improve performance, but it became clear that you cannot optimize what you cannot see.

## Building the Observability Stack

We did not rip and replace. We layered observability onto the existing infrastructure over about six weeks. Here is what we built:

**1. Structured logging with context.** The first change was making logs useful. We standardized on JSON logging with correlation IDs, so you could trace a request across services.

```javascript
// Before: useless in aggregate
console.log('Processing request for tenant');

// After: queryable, traceable
logger.info({
  event: 'request.processing',
  tenantId: req.tenantId,
  correlationId: req.headers['x-correlation-id'],
  service: 'identity-resolver',
  latencyMs: Date.now() - startTime,
});
```

**2. CloudWatch dashboards that answer questions.** The old dashboard showed CPU and memory. Useful for capacity planning, useless for incidents. We built dashboards organized around user-facing behavior:

- **Request flow:** Request rate, error rate, p50/p95/p99 latency by endpoint
- **Dependency health:** Database connection pool usage, cache hit rate, downstream API latency
- **Business metrics:** Provisioning success rate, identity sync completion rate

```json
{
  "metrics": [
    ["Custom/IdentityPlatform", "RequestLatencyP95",
     "Endpoint", "/api/v1/identities",
     { "stat": "p95", "period": 60 }],
    ["Custom/IdentityPlatform", "ErrorRate",
     "Endpoint", "/api/v1/identities",
     { "stat": "Average", "period": 60 }]
  ],
  "view": "timeSeries",
  "period": 60
}
```

**3. S3 log exports for post-incident analysis.** CloudWatch log retention gets expensive fast. We set up a Kinesis Firehose pipeline that exported all logs to S3 in Parquet format, partitioned by date and service. Querying a week of logs across all services went from "impossible" to a 30-second Athena query.

```sql
-- Find all errors for a specific tenant in the last 24 hours
SELECT timestamp, service, event, message, correlationId
FROM logs
WHERE tenantId = 'tenant-abc123'
  AND level = 'error'
  AND dt = '2025-09-01'
ORDER BY timestamp DESC
LIMIT 100;
```

**4. Actionable alerts with runbooks.** We deleted every existing alarm and started from scratch. Each new alarm had three requirements: a clear threshold based on SLO, a Slack message that included context (not just "alarm triggered"), and a linked runbook.

```yaml
# CloudWatch alarm definition
AlarmName: IdentityAPI-P95-Latency-Breach
MetricName: RequestLatencyP95
Namespace: Custom/IdentityPlatform
Threshold: 500
ComparisonOperator: GreaterThanThreshold
EvaluationPeriods: 3
Period: 60
AlarmActions:
  - !Ref OpsSnsTopic
```

When this alarm fires, the Slack notification says: "Identity API p95 latency exceeded 500ms for 3 consecutive minutes. Current value: 820ms. Runbook: [link]. Last deploy: 2h ago by @engineer."

## The Results

We measured the impact over a 3-month window compared to the same period the previous year:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Mean time to detect (MTTD) | 12 min | 2 min | -83% |
| Mean time to resolve (MTTR) | 112 min | 68 min | -39% |
| Monthly incident hours | 14h | 6h | -57% |
| Incidents caught before user report | 15% | 72% | +380% |

The 40% downtime reduction came from two things: catching issues before they became outages (proactive alerts), and resolving real incidents faster because we could see exactly what was wrong within minutes instead of guessing.

## What Most Teams Get Wrong

Observability is not dashboards. Dashboards are the output. Observability is the practice of instrumenting your system so that when something unexpected happens, you can answer "why" without deploying new code or adding new logging.

The three most common mistakes I see:

1. **Monitoring infrastructure instead of behavior.** CPU at 80% is not a problem. Users getting 500 errors is a problem. Start with what users experience and work backward.

2. **Alert fatigue.** If your team has muted the alerts channel, your alerts are noise, not signal. Fewer, higher-quality alerts with runbooks beat a wall of red.

3. **Treating observability as a project.** It is not something you build once. Every new feature, every new service, every schema change should include its observability story. "How will we know this is broken?" should be a standard question in code review.

You cannot improve what you cannot measure, and you cannot fix what you cannot see. Observability is not a nice-to-have. It is the foundation that everything else depends on.
