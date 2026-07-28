// Reutiliza los diccionarios que ya existen para las alertas — una sola
// fuente de verdad para SERVICE_LABEL / RESOURCE_TYPE_ICON / etc.
// Ajusta esta ruta según dónde hayas colocado los archivos del modal de alertas.
export {
  SERVICE_LABEL,
  RESOURCE_TYPE_ICON,
  RESOURCE_TYPE_LABEL,
  OPERATOR_SYMBOL,
} from '@/components/alerts/Cd-alertMeta';

interface EnabledStyle {
  label: string;
  dot: string;
  text: string;
  bg: string;
  border: string;
}

// Paleta propia de reglas: habilitada (emerald, igual que "Resuelta" en
// alertas) / deshabilitada (gris neutro — no es un estado "malo", solo apagado).
const ENABLED_STYLE: Record<'enabled' | 'disabled', EnabledStyle> = {
  enabled:  { label: 'Habilitada',    dot: '#16a34a', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  disabled: { label: 'Deshabilitada', dot: '#6b7280', text: 'text-gray-600',    bg: 'bg-gray-50',    border: 'border-gray-200' },
};

export function getEnabledStyle(enabled: boolean): EnabledStyle {
  return enabled ? ENABLED_STYLE.enabled : ENABLED_STYLE.disabled;
}

// AlertRule.createdAt llega como string (a diferencia de Alert.createdAt, que es Date)
export function formatRuleDate(date: string): string {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
