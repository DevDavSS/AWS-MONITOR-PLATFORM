import { ExternalLink } from 'lucide-react';
import type { Alert } from './types';

interface AlertModalFooterProps {
  alert: Alert;
  onViewResource?: (alert: Alert) => void;
  onViewRule?: (alert: Alert) => void;
}

/* ============================================================
 * <AlertModalFooter alert onViewResource onViewRule />
 * No renderiza nada si no le pasan ninguna acción.
 * ========================================================== */
export function AlertModalFooter({ alert, onViewResource, onViewRule }: AlertModalFooterProps) {
  if (!onViewResource && !onViewRule) return null;

  return (
    <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/60">
      {onViewRule && (
        <button onClick={() => onViewRule(alert)} className="inline-flex items-center gap-2 text-base text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-100">
          Ver regla <ExternalLink className="w-4 h-4" />
        </button>
      )}
      {onViewResource && (
        <button onClick={() => onViewResource(alert)} className="inline-flex items-center gap-2 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-lg">
          Ver recurso <ExternalLink className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}