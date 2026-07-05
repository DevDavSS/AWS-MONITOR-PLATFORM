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
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))`,
        }}
      >
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-sm text-muted-foreground">
              {metric.label}
            </p>

            <p className="text-2xl font-bold">
              {metric.value.toFixed(2)}
              {metric.unit ? ` ${metric.unit}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}