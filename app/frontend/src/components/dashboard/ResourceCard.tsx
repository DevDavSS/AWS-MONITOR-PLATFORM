interface ResourceCardProps {
  title: string;
  value: number;
}

export default function ResourceCard({
  title,
  value,
}: ResourceCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {title}
      </p>
      <p className="mt-3 font-mono text-4xl font-semibold text-gray-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}