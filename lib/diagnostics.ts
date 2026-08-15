export type DiagnosticInput = {
  annualRevenue: number;
  monthlyExpenses: number;
  cac: number;
  ltv: number;
  monthlyChurnRate: number;
  averageDealSize: number;
  salesCycleDays: number;
  industry?: string;
};

export type DiagnosticResult = {
  score: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  estimatedMonthlyLeakage: number;
  estimatedAnnualLeakage: number;
  primaryBottleneck: string;
  drivers: { metric: string; value: number; impact: 'low' | 'medium' | 'high' }[];
  recommendations: string[];
};

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const finite = (n: unknown) => typeof n === 'number' && Number.isFinite(n) ? n : 0;

export function diagnose(input: DiagnosticInput): DiagnosticResult {
  const revenue = Math.max(0, finite(input.annualRevenue));
  const expenses = Math.max(0, finite(input.monthlyExpenses));
  const cac = Math.max(0, finite(input.cac));
  const ltv = Math.max(0, finite(input.ltv));
  const churn = clamp(finite(input.monthlyChurnRate), 0, 100);
  const deal = Math.max(0, finite(input.averageDealSize));
  const cycle = Math.max(0, finite(input.salesCycleDays));

  const churnRisk = clamp(churn * 4);
  const cycleRisk = clamp((cycle - 30) * 1.25);
  const efficiencyRisk = cac > 0 && ltv > 0 ? clamp((1 - ltv / (cac * 3)) * 100) : 35;
  const expenseRisk = revenue > 0 ? clamp((expenses * 12 / revenue - 0.65) * 100) : 30;
  const score = Math.round(clamp(churnRisk * 0.3 + cycleRisk * 0.3 + efficiencyRisk * 0.25 + expenseRisk * 0.15));

  const monthlyRevenue = revenue / 12;
  const leakageRate = clamp(0.01 + score / 2500, 0.01, 0.05);
  const estimatedMonthlyLeakage = Math.round(monthlyRevenue * leakageRate);
  const estimatedAnnualLeakage = estimatedMonthlyLeakage * 12;

  const candidates = [
    { metric: 'Monthly churn', value: churn, impact: churnRisk >= 60 ? 'high' : churnRisk >= 30 ? 'medium' : 'low' as const, bottleneck: 'Retention / churn leakage' },
    { metric: 'Sales cycle', value: cycle, impact: cycleRisk >= 60 ? 'high' : cycleRisk >= 30 ? 'medium' : 'low' as const, bottleneck: 'Sales-cycle friction' },
    { metric: 'LTV:CAC efficiency', value: cac > 0 ? ltv / cac : 0, impact: efficiencyRisk >= 60 ? 'high' : efficiencyRisk >= 30 ? 'medium' : 'low' as const, bottleneck: 'Acquisition economics' },
    { metric: 'Expense / annual revenue', value: revenue > 0 ? (expenses * 12) / revenue : 0, impact: expenseRisk >= 60 ? 'high' : expenseRisk >= 30 ? 'medium' : 'low' as const, bottleneck: 'Operating efficiency' },
  ];

  const primary = [...candidates].sort((a, b) => {
    const rank = (x: string) => x === 'high' ? 3 : x === 'medium' ? 2 : 1;
    return rank(b.impact) - rank(a.impact);
  })[0];

  return {
    score,
    severity: score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low',
    estimatedMonthlyLeakage,
    estimatedAnnualLeakage,
    primaryBottleneck: primary.bottleneck,
    drivers: candidates.map(({ metric, value, impact }) => ({ metric, value, impact })),
    recommendations: [
      'Validate the highest-risk driver against CRM and finance evidence before taking corrective action.',
      'Quantify leakage at opportunity/account level rather than relying on aggregate averages.',
      'Assign one executive owner and a measurable recovery target to the primary bottleneck.',
    ],
  };
}
