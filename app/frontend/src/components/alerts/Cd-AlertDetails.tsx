import type { ReactNode } from 'react';
import { Building2, CreditCard, MapPin, Clock, Hash, type LucideIcon } from 'lucide-react';
import type { Alert } from './types';
import {
  SERVICE_LABEL, RESOURCE_TYPE_LABEL,
  formatDateTime, formatDuration,
} from './Cd-alertMeta';

interface AlertDetailsProps {
  alert: Alert;
}
 
/* ============================================================
 * <AlertDetails alert />
 * Pinta las dos secciones de abajo: datos del recurso y
 * datos de la regla/tiempos.
 * ========================================================== */
export function AlertDetails({ alert }: AlertDetailsProps) {
  const isResolved = alert.state === 'RESOLVED' && !!alert.resolvedAt;
 
  return (
    <div className="space-y-8">
      <Section title="Recurso">
        <dl className="grid grid-cols-3 gap-x-6 gap-y-5 text-base">
          <Item label="Servicio" value={SERVICE_LABEL[alert.service] ?? alert.service} />
          <Item label="Tipo" value={RESOURCE_TYPE_LABEL[alert.resourceType] ?? alert.resourceType} />
          <Item label="ID de recurso" value={alert.resourceId} mono />
          <Item label="Región" icon={MapPin} value={alert.region} />
          <Item label="Cuenta AWS" icon={CreditCard} value={alert.accountId} mono />
          <Item label="Organización" icon={Building2} value={alert.organizationId} />
        </dl>
      </Section>
 
      <Section title="Regla y tiempos">
        <dl className="grid grid-cols-3 gap-x-6 gap-y-5 text-base">
          <Item label="ID de regla" icon={Hash} value={alert.ruleId} mono />
          <Item label="ID de alerta" icon={Hash} value={alert.id} mono />
          <Item label="Creada" icon={Clock} value={formatDateTime(alert.createdAt)} />
          {isResolved ? (
            <Item label="Resuelta" icon={Clock} value={formatDateTime(alert.resolvedAt as Date)} />
          ) : (
            <Item label="Duración activa" icon={Clock} value={formatDuration(alert.createdAt, new Date())} />
          )}
          {isResolved && (
            <Item label="Tiempo de resolución" value={formatDuration(alert.createdAt, alert.resolvedAt as Date)} />
          )}
        </dl>
      </Section>
    </div>
  );
}
 
interface SectionProps {
  title: string;
  children: ReactNode;
}
 
function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{title}</h4>
      {children}
    </div>
  );
}
 
interface ItemProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  mono?: boolean;
  className?: string;
}
 
function Item({ label, value, icon: Icon, mono, className = '' }: ItemProps) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </dt>
      <dd className={`text-gray-800 ${mono ? 'font-mono text-sm' : 'text-base'} truncate`}>{value}</dd>
    </div>
  );
}