interface BadgeStyle {
  label: string;
  dot: string;
  text: string;
  bg: string;
  border: string;
}

const HEALTHY_STATUSES = new Set(["running", "available", "active", "ready", "healthy"]);
const INACTIVE_STATUSES = new Set(["stopped", "terminated", "inactive", "notready", "not ready", "not_ready"]);

/* ============================================================
 * <StatusBadge status="AVAILABLE" />
 * Normaliza a minúsculas para reconocer el estado sin importar
 * el casing que use cada servicio (EC2: "running", RDS: "available",
 * EKS: "ACTIVE"...). Todo lo que no se reconoce cae en ámbar neutro.
 * ========================================================== */
export function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase();

  const style: BadgeStyle = HEALTHY_STATUSES.has(key)
    ? { label: status, dot: "#16a34a", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
    : INACTIVE_STATUSES.has(key)
    ? { label: status, dot: "#6b7280", text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" }
    : { label: status, dot: "#d97706", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
      {style.label}
    </span>
  );
}

/* ============================================================
 * <BoolBadge value={instance.cloudWatchAgent} />
 * ========================================================== */
export function BoolBadge({
  value,
  trueLabel = "Sí",
  falseLabel = "No",
}: {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        value
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}