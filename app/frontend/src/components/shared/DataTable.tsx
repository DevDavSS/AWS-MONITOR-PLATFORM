import { useEffect, useState, type ReactNode } from "react";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  /** Filas por página. Default 10. */
  pageSize?: number;
  /** Alto máximo del área de la tabla antes de que scrollee internamente. */
  maxHeight?: string;
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
  loading = false,
  emptyMessage = "Sin resultados",
  pageSize = 20,
  maxHeight = "660px",
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  // Si cambia el tamaño del set de datos (nueva búsqueda/filtro), regresa a la página 1.
  // Se usa data.length en vez de `data` para no resetear en cada render por
  // referencias de array nuevas que no cambian el contenido realmente.
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-4 py-3.5 border-b border-gray-100 last:border-0 animate-pulse"
          >
            {columns.map((col) => (
              <div key={col.key} className="h-4 flex-1 bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-gray-200 rounded-lg">
        <Inbox className="w-6 h-6 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-700">{emptyMessage}</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* área con scroll propio — el header queda pegado arriba */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pageData.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-gray-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginación */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white">
        <p className="text-xs text-gray-400">
          Mostrando {start + 1}–{Math.min(start + pageSize, data.length)} de {data.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 px-1.5 tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}