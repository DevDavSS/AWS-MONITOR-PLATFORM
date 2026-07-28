import { Pencil, Server } from 'lucide-react';
import type { AlertRule } from '@/types/AlertRule';
import { SERVICE_LABEL, RESOURCE_TYPE_ICON, RESOURCE_TYPE_LABEL, OPERATOR_SYMBOL } from './ruleMeta';
import { getEnabledStyle, formatRuleDate } from './ruleMeta';

interface RuleCardProps {
  rule: AlertRule;
  onUpdate: (rule: AlertRule) => void;
}

export function RuleCard({ rule, onUpdate }: RuleCardProps) {
  const style = getEnabledStyle(rule.enabled);
  const resourceTypeKey = rule.resourceType as keyof typeof RESOURCE_TYPE_ICON;
  const ResourceIcon = RESOURCE_TYPE_ICON[resourceTypeKey] ?? Server;
  const serviceLabel = SERVICE_LABEL[rule.service as keyof typeof SERVICE_LABEL] ?? rule.service;
  const resourceTypeLabel = RESOURCE_TYPE_LABEL[rule.resourceType as keyof typeof RESOURCE_TYPE_LABEL] ?? rule.resourceType;

  return (
  <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-4 h-full hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">

          <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${style.bg} border ${style.border}`}>
            <ResourceIcon className="w-4.5 h-4.5" style={{ color: style.dot }} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {rule.metric}
            </p>

            <p className="text-xs text-gray-400 truncate">
              {serviceLabel} · {resourceTypeLabel}
            </p>
          </div>

        </div>

        <span className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
          {style.label}
        </span>

      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 space-y-2">

        <div className="text-xs text-gray-500">
          Rule ID:
          <span className="ml-1 font-mono text-gray-700">
            {rule.id}
          </span>
        </div>

      <div className="text-xs text-gray-500">
        Resource IDs:
        <span className="ml-1 font-mono text-gray-700">
          {rule.resourceIds.length > 0
            ? `${rule.resourceIds.slice(0, 5).join(", ")}${rule.resourceIds.length > 5
                ? ` ... +${rule.resourceIds.length - 5} más`
                : ""}`
            : "Global"}
        </span>
      </div>

      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">

        <div className="flex items-baseline gap-2 font-mono">
          <span className="text-xl font-semibold text-gray-800">
            {OPERATOR_SYMBOL[rule.operator] ?? rule.operator}
          </span>

          <span className="text-xl font-semibold text-gray-800">
            {rule.threshold}
          </span>

          <span className="text-xs text-gray-400 ml-1">
            umbral
          </span>
        </div>

      </div>

  <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="text-xs text-gray-400">
          Creada {formatRuleDate(rule.createdAt)}
        </span>

        <button
          onClick={() => onUpdate(rule)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
        >
          <Pencil className="w-3.5 h-3.5" />
          Actualizar
        </button>

      </div>

    </div>
  );
}