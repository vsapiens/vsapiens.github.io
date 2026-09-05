import { expect, test } from 'vitest';
import { experienceEvidence, featuredCaseStudies, projectArchive, services } from './site';
import experience from './experience.json';

test('publishes the four approved service prices', () => {
  expect(services.map(({ id, price }) => ({ id, price }))).toEqual([
    { id: 'diagnosis', price: { usd: 500, mxn: 10000 } },
    { id: 'performance-audit', price: { usd: 1500, mxn: 30000 } },
    { id: 'agent-workflow', price: { usd: 2500, mxn: 50000 } },
    { id: 'backend-mvp', price: { usd: 5000, mxn: 100000 } },
  ]);
});

test('exposes every approved featured story and the complete project archive', () => {
  expect(featuredCaseStudies.map(({ slug }) => slug)).toEqual([
    'performance-at-scale',
    'vitrina',
    'miso-os',
    'agentos',
    'mx-stock-analyzer',
    'open-source-performance-toolkit',
  ]);
  expect(projectArchive).toHaveLength(15);
});

test('publishes a duration and fixed pricing for every service, and credit only on the diagnosis', () => {
  for (const service of services) {
    expect(service.pricing).toBe('fixed');
    expect(service.duration.en.length).toBeGreaterThan(0);
    expect(service.duration.es.length).toBeGreaterThan(0);
  }
  expect(services.filter((service) => service.credit).map((service) => service.id)).toEqual(['diagnosis']);
  expect(services[0].credit).toEqual({ windowDays: 30, towardServiceId: 'performance-audit' });
});

test('backs every experience evidence metric with a verbatim excerpt from the work history', () => {
  expect(experienceEvidence).toHaveLength(3);
  for (const metric of experienceEvidence) {
    const job = experience.find((entry) => entry.company === metric.source.company);
    expect(job, `${metric.source.company} should exist in experience.json`).toBeDefined();
    expect(job?.description.some((line) => line.includes(metric.source.excerpt)), `${metric.source.excerpt} should appear in ${metric.source.company}`).toBe(true);
    expect(metric.context.en).toContain(metric.source.company);
  }
});
