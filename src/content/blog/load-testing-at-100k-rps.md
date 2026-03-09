---
title: "What I Learned Running Load Tests at 100,000 Requests Per Second"
description: "Lessons from designing cloud-scale k6 load tests for a dealer auction platform. Distributed test execution, burst traffic simulation, and what New Relic actually tells you."
date: 2023-08-20
tags: ["performance", "k6", "load-testing", "cloud", "ci-cd"]
---

## You Think You Know Load Testing. You Don't.

Before joining Globant, I thought load testing meant writing a script, cranking up the virtual users, and watching a dashboard. I was wrong. Real load testing at scale is an engineering discipline of its own, and the hardest part has nothing to do with the tool.

At Globant, I was responsible for performance validation on a dealer auction platform that processed live vehicle bids. Peak traffic happened in predictable bursts -- auction events that lasted 30 to 90 minutes with thousands of concurrent bidders. A single dropped bid meant lost revenue and angry dealers.

The target: prove the platform could handle 100,000 requests per second during a simulated auction burst.

## The Setup

We used k6 for test scripting, distributed across multiple cloud VMs to generate enough load. A single machine tops out around 10,000-15,000 RPS depending on the scenario complexity. To hit 100k, we needed coordinated execution across 12 load generators.

```javascript
// k6 auction burst scenario
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failRate = new Rate('failed_requests');

export const options = {
  scenarios: {
    auction_burst: {
      executor: 'ramping-arrival-rate',
      startRate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 5000,
      maxVUs: 10000,
      stages: [
        { target: 5000, duration: '1m' },   // ramp
        { target: 8500, duration: '2m' },   // sustained
        { target: 8500, duration: '5m' },   // hold peak
        { target: 0, duration: '30s' },     // drain
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1200'],
    failed_requests: ['rate<0.01'],
  },
};

export default function () {
  const res = http.post(`${__ENV.BASE_URL}/api/bids`, JSON.stringify({
    auctionId: `auction-${Math.floor(Math.random() * 50)}`,
    dealerId: `dealer-${__ENV.VU_ID}`,
    amount: Math.floor(Math.random() * 50000) + 10000,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, { 'status is 200': (r) => r.status === 200 });
  failRate.add(res.status !== 200);
}
```

Each load generator ran a slice of this scenario (roughly 8,500 RPS each). We coordinated start times using a simple shell script that SSH'd into each VM and kicked off k6 simultaneously.

## The Three Things That Surprised Me

**1. The load generators are the first bottleneck.** Our initial runs showed request timeouts, but the problem was not the application -- it was the test machines running out of file descriptors. We burned two days debugging the app before realizing the load generators themselves were saturated. Always monitor your test infrastructure.

**2. Realistic data distribution matters more than raw volume.** Our first test used random auction IDs uniformly distributed. In production, 80% of traffic hits the 3-4 active auctions. When we switched to a weighted distribution, the database hot-spotting pattern changed completely, and latency doubled. The "passing" test had been hiding a real problem.

**3. CI/CD integration is where the real value lives.** Running a big load test once proves a point. Running a smaller smoke test (5,000 RPS, 60 seconds) on every deployment catches regressions before they accumulate. We integrated k6 into the CI pipeline:

```yaml
# GitHub Actions step
- name: Performance smoke test
  run: |
    k6 run --out json=results.json \
      -e BASE_URL=${{ secrets.STAGING_URL }} \
      tests/perf/smoke-auction.js
  timeout-minutes: 5

- name: Check thresholds
  run: |
    node scripts/check-perf-thresholds.js results.json
```

This caught a 3x latency regression from an ORM change that passed every unit and integration test.

## Reading the Results

New Relic was our observability layer. The mistake most teams make is staring at averages. Averages lie. During our 100k RPS test, average response time was 120ms -- perfectly fine. But p99 was 4.2 seconds, meaning 1,000 requests per second were unacceptably slow.

The fix was in connection pool tuning. The database had 100 max connections, and under peak load, requests queued for a connection. Bumping to 200 connections and adding PgBouncer as a pooler dropped p99 from 4.2 seconds to 380ms.

## The Lesson

Load testing is not about proving your system works. It is about finding the specific way it breaks. Every system breaks -- at some concurrency level, some data pattern, some resource limit. The job is to find that breaking point before your users do and decide whether to fix it or accept it.

We hit 100k RPS. More importantly, we found and fixed four production-quality bugs that functional tests never would have caught. That is the real return on investment.
