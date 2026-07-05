interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="text-left p-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b ${
                onRowClick ? "hover:bg-muted cursor-pointer" : ""
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}