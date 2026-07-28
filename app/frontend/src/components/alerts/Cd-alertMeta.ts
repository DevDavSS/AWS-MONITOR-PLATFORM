import { Server, Database, Boxes, Layers, Cpu, Radio, type LucideIcon } from 'lucide-react';
import type { AlertService, ResourceType, AlertOperator } from './types';

interface StateStyle {
  label: string;
  dot: string;
  text: string;
  bg: string;
  border: string;
}

// `state` llega como string desde el microservicio; se tipa como
// Record<string, ...> con fallback en cada componente que lo usa.
export const STATE_STYLE: Record<string, StateStyle> = {
  ACTIVE:   { label: 'Activa',   dot: '#e11d48', text: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
  RESOLVED: { label: 'Resuelta', dot: '#16a34a', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export const SERVICE_LABEL: Record<AlertService, string> = {
  ec2: 'EC2',
  eks: 'EKS',
  rds: 'RDS',
  meraki: 'Meraki',
};

export const RESOURCE_TYPE_ICON: Record<ResourceType, LucideIcon> = {
  instance: Server,
  database: Database,
  cluster: Boxes,
  nodegroup: Layers,
  node: Cpu,
  device: Radio,
};

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  instance: 'Instancia',
  database: 'Base de datos',
  cluster: 'Clúster',
  nodegroup: 'Node group',
  node: 'Nodo',
  device: 'Dispositivo',
};

export const OPERATOR_SYMBOL: Record<AlertOperator, string> = {
  '>': '>',
  '>=': '≥',
  '<': '<',
  '<=': '≤',
  '=': '=',
  '!=': '≠',
};

export function evaluateOperator(current: number, op: AlertOperator, threshold: number): boolean {
  switch (op) {
    case '>': return current > threshold;
    case '>=': return current >= threshold;
    case '<': return current < threshold;
    case '<=': return current <= threshold;
    case '=': return current === threshold;
    case '!=': return current !== threshold;
    default: return false;
  }
}

export function formatDateTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDuration(fromDate: Date, toDate: Date): string {
  const from = fromDate instanceof Date ? fromDate : new Date(fromDate);
  const to = toDate instanceof Date ? toDate : new Date(toDate);
  const minutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) return `${hours} h ${rest} min`;
  const days = Math.floor(hours / 24);
  return `${days} d ${hours % 24} h`;
}

export function formatValue(v: number): string {
  return Number.isInteger(v) ? v.toString() : v.toFixed(2);
}
