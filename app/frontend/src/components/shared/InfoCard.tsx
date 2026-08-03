import type { ReactNode } from "react";

interface InfoField<T> {
  label: string;
  render: (data: T) => ReactNode;
}

interface InfoCardProps<T> {
  title: string;
  data: T;
  fields: InfoField<T>[];
}

export default function InfoCard<T>({
  title,
  data,
  fields,
}: InfoCardProps<T>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        {title}
      </h2>

      <dl className="grid grid-cols-2 gap-x-12 gap-y-5">
        {fields.map((field, index) => (
          <div key={index}>
            <dt className="text-xs text-gray-400 mb-1">{field.label}</dt>
            <dd className="text-sm text-gray-800">{field.render(data)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}