import { expect, test } from 'vitest';
import { featuredCaseStudies, projectArchive, services } from './site';

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
