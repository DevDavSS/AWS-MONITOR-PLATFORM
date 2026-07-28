import { Gauge } from 'lucide-react';
import type { Alert } from './types';
import { OPERATOR_SYMBOL, evaluateOperator, formatValue } from './Cd-alertMeta';

interface AlertMetricCardProps {
  alert: Alert;
}
 
/* ============================================================
 * <AlertMetricCard alert />
 * Muestra la condición evaluada en grande: metric, currentValue,
 * operator y threshold. Se colorea en rojo si la condición se
 * está cumpliendo actualmente.
 * ========================================================== */
export function AlertMetricCard({ alert }: AlertMetricCardProps) {
  const breached = evaluateOperator(alert.currentValue, alert.operator, alert.threshold);
 
  return (
    <div className={`rounded-xl border p-6 ${breached ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Gauge className="w-5 h-5" />
        {alert.metric}
      </div>
      <div className="flex items-baseline gap-4 font-mono">
        <span className={`text-6xl font-bold tracking-tight ${breached ? 'text-rose-700' : 'text-gray-800'}`}>
          {formatValue(alert.currentValue)}
        </span>
        <span className={`text-3xl font-semibold ${breached ? 'text-rose-500' : 'text-gray-400'}`}>
          {OPERATOR_SYMBOL[alert.operator] ?? alert.operator}
        </span>
        <span className="text-2xl text-gray-500">{formatValue(alert.threshold)}</span>
        <span className="text-sm text-gray-400">(umbral)</span>
      </div>
    </div>
  );
}
 