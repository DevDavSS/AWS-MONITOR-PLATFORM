import { Inbox } from 'lucide-react';
import type { AlertRule } from '@/types/AlertRule';
import { RuleCard } from './RuleCard';

interface RulesGridProps {
  rules: AlertRule[];
  loading?: boolean;
  onUpdate: (rule: AlertRule) => void;
}

/* ============================================================
 * <RulesGrid rules loading onUpdate />
 * Contenedor "tonto": recibe la lista ya filtrada por RulePanel
 * y decide solo cómo pintarla (grid / skeleton / vacío).
 * ========================================================== */
export function RulesGrid({ rules, loading = false, onUpdate }: RulesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <RuleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-gray-200 rounded-lg">
        <Inbox className="w-6 h-6 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-700">Este recurso no tiene reglas configuradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function RuleCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gray-100" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-12 bg-gray-100 rounded-lg" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  );
}
