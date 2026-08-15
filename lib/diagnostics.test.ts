import { describe, expect, it } from 'vitest';
import { diagnose } from './diagnostics';

const baseline = {
  annualRevenue: 12_000_000,
  monthlyExpenses: 500_000,
  cac: 20_000,
  ltv: 120_000,
  monthlyChurnRate: 1,
  averageDealSize: 60_000,
  salesCycleDays: 45,
};

describe('diagnostic engines', () => {
  it('returns all 12 engines with bounded scores', () => {
    const result = diagnose(baseline);
    expect(result.engines).toHaveLength(12);
    expect(new Set(result.engines.map((e) => e.engine)).size).toBe(12);
    for (const engine of result.engines) {
      expect(engine.score).toBeGreaterThanOrEqual(0);
      expect(engine.score).toBeLessThanOrEqual(100);
      expect(engine.estimatedLeakage).toBeGreaterThanOrEqual(0);
      expect(engine.recommendations.length).toBeGreaterThan(0);
    }
  });

  it('identifies sales-cycle risk as a high driver when the cycle is extreme', () => {
    const result = diagnose({ ...baseline, salesCycleDays: 180 });
    const engine = result.engines.find((e) => e.engine === 'Sales Cycle Drag');
    expect(engine).toBeDefined();
    expect(engine!.score).toBeGreaterThan(90);
  });

  it('responds to churn changes', () => {
    const low = diagnose({ ...baseline, monthlyChurnRate: 0.5 });
    const high = diagnose({ ...baseline, monthlyChurnRate: 8 });
    const lowChurn = low.engines.find((e) => e.engine === 'Churn Exposure')!;
    const highChurn = high.engines.find((e) => e.engine === 'Churn Exposure')!;
    expect(highChurn.score).toBeGreaterThan(lowChurn.score);
  });

  it('keeps zero-valued inputs safe and finite', () => {
    const result = diagnose({
      annualRevenue: 0,
      monthlyExpenses: 0,
      cac: 0,
      ltv: 0,
      monthlyChurnRate: 0,
      averageDealSize: 0,
      salesCycleDays: 0,
    });
    expect(Number.isFinite(result.score)).toBe(true);
    expect(Number.isFinite(result.estimatedAnnualLeakage)).toBe(true);
    expect(result.engines).toHaveLength(12);
  });
});
