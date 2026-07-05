interface InfoField<T> {
  label: string;
  render: (data: T) => React.ReactNode;
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
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <span className="font-medium">{field.label}:</span>{" "}
            {field.render(data)}
          </div>
        ))}
      </div>
    </div>
  );
}