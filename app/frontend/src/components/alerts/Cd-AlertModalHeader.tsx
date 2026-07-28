import { X, Server } from 'lucide-react';
import type { Alert } from './types';
import { STATE_STYLE, RESOURCE_TYPE_ICON } from './Cd-alertMeta';

interface AlertModalHeaderProps {
  alert: Alert;
  onClose: () => void;
}
 
/* ============================================================
 * <AlertModalHeader alert onClose />
 * ========================================================== */
export function AlertModalHeader({ alert, onClose }: AlertModalHeaderProps) {
  const st = STATE_STYLE[alert.state] ?? STATE_STYLE.ACTIVE;
  const ResourceIcon = RESOURCE_TYPE_ICON[alert.resourceType] ?? Server;
 
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-gray-100">
      <div className="flex items-start gap-4 min-w-0">
        <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${st.bg} border ${st.border}`}>
          <ResourceIcon className="w-7 h-7" style={{ color: st.dot }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-gray-900 truncate">{alert.resourceName}</h3>
            <span className={`inline-flex items-center gap-1.5 shrink-0 text-sm font-medium px-3 py-1 rounded-full ${st.bg} ${st.text} border ${st.border}`}>
              <span className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
              {st.label}
            </span>
          </div>
          <p className="text-sm text-gray-400 font-mono mt-1.5 truncate">{alert.resourceId}</p>
        </div>
      </div>
      <button onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-600 rounded-lg p-2 hover:bg-gray-50">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
 