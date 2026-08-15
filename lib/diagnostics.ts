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

export type EngineName =
  | 'Deal Friction' | 'Pipeline Leakage' | 'Ghosting Risk' | 'Discount Erosion'
  | 'Champion Risk' | 'ROI Defensibility' | 'Sales Cycle Drag' | 'Expansion Leakage'
  | 'Churn Exposure' | 'Forecast Risk' | 'Pricing Leakage' | 'Revenue Recovery';

export type DriverImpact = 'low' | 'medium' | 'high';

export type EngineResult = {
  engine: EngineName;
  score: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  estimatedLeakage: number;
  signal: string;
  recommendations: string[];
};

export type DiagnosticResult = {
  score: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  estimatedMonthlyLeakage: number;
  estimatedAnnualLeakage: number;
  primaryBottleneck: string;
  drivers: { metric: string; value: number; impact: DriverImpact }[];
  recommendations: string[];
  engines: EngineResult[];
};

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const finite = (n: unknown) => typeof n === 'number' && Number.isFinite(n) ? n : 0;
const severity = (score: number): DiagnosticResult['severity'] => score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low';
const impact = (score: number): DriverImpact => score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';

export function diagnose(input: DiagnosticInput): DiagnosticResult {
  const revenue = Math.max(0, finite(input.annualRevenue));
  const expenses = Math.max(0, finite(input.monthlyExpenses));
  const cac = Math.max(0, finite(input.cac));
  const ltv = Math.max(0, finite(input.ltv));
  const churn = clamp(finite(input.monthlyChurnRate));
  const deal = Math.max(0, finite(input.averageDealSize));
  const cycle = Math.max(0, finite(input.salesCycleDays));
  const monthlyRevenue = revenue / 12;
  const ltvCac = cac > 0 ? ltv / cac : 0;
  const expenseRatio = revenue > 0 ? expenses * 12 / revenue : 1;
  const cycleRisk = clamp((cycle - 30) * 1.25);
  const churnRisk = clamp(churn * 4);
  const efficiencyRisk = cac > 0 && ltv > 0 ? clamp((1 - ltv / (cac * 3)) * 100) : 35;
  const expenseRisk = clamp((expenseRatio - 0.65) * 100);
  const dealRisk = deal > 0 ? clamp((25000 - deal) / 250) : 40;

  const raw = {
    'Deal Friction': clamp(cycleRisk * 0.7 + dealRisk * 0.3),
    'Pipeline Leakage': clamp(cycleRisk * 0.55 + (100 - clamp(ltvCac * 20)) * 0.45),
    'Ghosting Risk': clamp(cycleRisk * 0.65 + churnRisk * 0.35),
    'Discount Erosion': clamp((100 - clamp(deal / 500, 0, 100)) * 0.45 + efficiencyRisk * 0.55),
    'Champion Risk': clamp(cycleRisk * 0.45 + churnRisk * 0.55),
    'ROI Defensibility': clamp(efficiencyRisk * 0.75 + cycleRisk * 0.25),
    'Sales Cycle Drag': cycleRisk,
    'Expansion Leakage': clamp(churnRisk * 0.6 + efficiencyRisk * 0.4),
    'Churn Exposure': churnRisk,
    'Forecast Risk': clamp(cycleRisk * 0.5 + (100 - clamp(ltvCac * 25)) * 0.5),
    'Pricing Leakage': clamp((100 - clamp(deal / 500, 0, 100)) * 0.6 + efficiencyRisk * 0.4),
    'Revenue Recovery': clamp(churnRisk * 0.25 + cycleRisk * 0.3 + efficiencyRisk * 0.25 + expenseRisk * 0.2),
  } satisfies Record<EngineName, number>;

  const engines = (Object.entries(raw) as [EngineName, number][]).map(([engine, score]) => ({
    engine,
    score: Math.round(score),
    severity: severity(score),
    estimatedLeakage: Math.round(monthlyRevenue * clamp(0.002 + score / 10000, 0.002, 0.015)),
    signal: score >= 60 ? 'High-risk revenue signal requiring evidence validation.' : score >= 30 ? 'Moderate revenue signal requiring investigation.' : 'Low current signal; monitor for change.',
    recommendations: [
      `Validate ${engine.toLowerCase()} against CRM, finance, and customer evidence.`,
      'Quantify the affected opportunities or accounts before changing process or pricing.',
    ],
  }));

  const overallScore = Math.round(clamp(engines.reduce((sum, item) => sum + item.score, 0) / engines.length));
  const primary = [...engines].sort((a, b) => b.score - a.score)[0];
  const estimatedMonthlyLeakage = Math.round(monthlyRevenue * clamp(0.01 + overallScore / 2500, 0.01, 0.05));

  return {
    score: overallScore,
    severity: severity(overallScore),
    estimatedMonthlyLeakage,
    estimatedAnnualLeakage: estimatedMonthlyLeakage * 12,
    primaryBottleneck: primary.engine,
    drivers: [
      { metric: 'Monthly churn', value: churn, impact: impact(churnRisk) },
      { metric: 'Sales cycle', value: cycle, impact: impact(cycleRisk) },
      { metric: 'LTV:CAC', value: ltvCac, impact: impact(efficiencyRisk) },
      { metric: 'Expense / annual revenue', value: expenseRatio, impact: impact(expenseRisk) },
    ],
    recommendations: [
      `Start with ${primary.engine}; it has the highest modeled risk signal.`,
      'Validate the modeled signal against CRM and finance evidence before taking corrective action.',
      'Assign one executive owner and a measurable recovery target to the confirmed bottleneck.',
    ],
    engines,
  };
}
