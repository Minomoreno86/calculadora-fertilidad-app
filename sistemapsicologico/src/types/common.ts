// Tipos comunes para el sistema psicológico

export type RiskLevel = 'bajo' | 'moderado' | 'alto';

export type AlertType = 'info' | 'warning' | 'danger';

export type MoodLevel = 'excellent' | 'good' | 'regular' | 'difficult';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface ScoreResult {
  total: number;
  riskLevel: RiskLevel;
}

export interface TrendData {
  direction: TrendDirection;
  change: number;
  label: string;
}
