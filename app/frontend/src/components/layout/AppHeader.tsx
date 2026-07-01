import { useHeader } from "./HeaderContext";

export default function AppHeader() {
  const { extraFilters } = useHeader();
  return (
    <header className="border-b px-6 py-4">
      <div className="flex items-start gap-4">



        {/* Título + Filtros */}
        <div className="flex flex-col gap-2">

          <h1 className="text-2xl font-bold">
            AWS PROD Monitoring Dashboard 
          </h1>

          <div className="flex gap-4">
            <div>Organization Select</div>
            <div>Account Select</div>
            <div>Region Select</div>
            {extraFilters}
          </div>

        </div>

      </div>
    </header>
  );
}