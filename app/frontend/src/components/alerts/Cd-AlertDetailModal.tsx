import { useState } from 'react';
import type { Alert } from './types';
import { Modal } from './Cd-Modal';
import { AlertModalHeader } from './Cd-AlertModalHeader';
import { AlertMetricCard } from './Cd-AlertMetricCard';
import { AlertDetails } from './Cd-AlertDetails';
import { AlertModalFooter } from './Cd-AlertModalFooter';

interface AlertDetailModalProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
  onViewResource?: (alert: Alert) => void;
  onViewRule?: (alert: Alert) => void;
}

/* ============================================================
 * <AlertDetailModal alert open onClose onViewResource onViewRule />
 * No dibuja nada por sí mismo: arma el Modal y reparte la misma
 * interfaz `Alert` a cada hijo.
 * ========================================================== */
export function AlertDetailModal({ alert, open, onClose, onViewResource, onViewRule }: AlertDetailModalProps) {
  if (!alert) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <AlertModalHeader alert={alert} onClose={onClose} />

      <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
        <AlertMetricCard alert={alert} />
        <AlertDetails alert={alert} />
      </div>

      <AlertModalFooter alert={alert} onViewResource={onViewResource} onViewRule={onViewRule} />
    </Modal>
  );
}

/* ============================================================
 * DEMO
 * ========================================================== */
const MOCK_ALERT: Alert = {
  id: 'al-8841',
  ruleId: 'rule-cpu-high',
  organizationId: 'sofom',
  accountId: '833329618359',
  region: 'us-east-1',
  service: 'ec2',
  resourceType: 'instance',
  resourceId: 'i-0a1b2c3d4e5f6',
  resourceName: 'api-gateway-prod-1',
  metric: 'CPUUtilization',
  operator: '>',
  currentValue: 96.4,
  threshold: 90,
  state: 'ACTIVE',
  createdAt: new Date(Date.now() - 1000 * 60 * 47),
};

const MOCK_RESOLVED_ALERT: Alert = {
  ...MOCK_ALERT,
  id: 'al-8790',
  state: 'RESOLVED',
  currentValue: 62.1,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
};

export default function AlertDetailModalDemo() {
  const [openId, setOpenId] = useState<'active' | 'resolved' | null>(null);
  const alert = openId === 'active' ? MOCK_ALERT : openId === 'resolved' ? MOCK_RESOLVED_ALERT : null;

  return (
    <div className="max-w-md mx-auto p-8 space-y-3">
      <button onClick={() => setOpenId('active')} className="w-full text-sm font-medium bg-gray-900 text-white rounded-md py-2 hover:bg-gray-800">
        Ver alerta activa
      </button>
      <button onClick={() => setOpenId('resolved')} className="w-full text-sm font-medium border border-gray-300 rounded-md py-2 hover:bg-gray-50">
        Ver alerta resuelta
      </button>

      <AlertDetailModal
        alert={alert}
        open={!!openId}
        onClose={() => setOpenId(null)}
        onViewResource={(a) => console.log('ir al recurso', a.resourceId)}
        onViewRule={(a) => console.log('ir a la regla', a.ruleId)}
      />
    </div>
  );
}
