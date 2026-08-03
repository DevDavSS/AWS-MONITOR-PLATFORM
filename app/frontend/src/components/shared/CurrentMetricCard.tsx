interface Metric {
  label: string;
  value: number;
  unit?: string;
}

interface MetricsCardProps {
  title: string;
  metrics: Metric[];
}

export default function MetricsCard({
  title,
  metrics,
}: MetricsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">
        {title}
      </h2>

      <div
        className="grid divide-x divide-gray-100"
        style={{
          gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))`,
        }}
      >
        {metrics.map((metric, index) => (
          <div key={metric.label} className={index > 0 ? "pl-6" : ""}>
            <p className="text-xs text-gray-400 mb-1">
              {metric.label}
            </p>

            <p className="font-mono text-3xl font-semibold text-gray-900">
              {metric.value.toFixed(2)}
              {metric.unit && (
                <span className="text-base font-normal text-gray-400 ml-1">
                  {metric.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}