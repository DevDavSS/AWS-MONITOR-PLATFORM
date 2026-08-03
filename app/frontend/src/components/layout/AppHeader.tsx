import type { ReactNode } from "react";
import { useHeader } from "./HeaderContext";
import { useFilters } from "@/contexts/FilterContext";
import { CacheStatus } from "@/components/shared/CacheStatus";
import { useState, useEffect } from "react";
import { getOrganizations, getAccounts } from "@/services/organizationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

interface Organization {
    id: string;
    name: string;
}

interface Account {
    id: string;
    name: string;
}

export default function AppHeader() {
  const { extraFilters, filtersEnabled } = useHeader();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const {filters, setOrganization, setAccount, setRegion } = useFilters();

    useEffect(() => {

      const loadOrganizations = async () => {

          const organizations =
              await getOrganizations();

          setOrganizations(
              organizations
          );

      };

      loadOrganizations();

  }, []);
  useEffect(() => {

      const loadAccounts = async () => {

          if (!filters.organizationId) {

              setAccounts([]);

              return;

          }

          const accounts =
              await getAccounts(
                  filters.organizationId
              );

          setAccounts(
              accounts
          );

      };

      loadAccounts();

  }, [filters.organizationId]);

    const selectedAccountName =
        filters.accountId === "all" || !filters.accountId
            ? "Todas las cuentas"
            : accounts.find(
                (account) => account.id === filters.accountId
            )?.name ?? "Seleccionar cuenta";

    const regions = [
        "us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
    ];

  return (
  <header
    className="
        fixed
        top-0
        left-60
        right-0
        z-40
        border-b
        border-gray-100
        bg-white
        px-6
        py-4
    "
>
    <div className="flex items-start justify-between gap-4">

        {/* Título + Filtros */}
        <div className="flex flex-col gap-3">

          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            AWS PROD Monitoring Dashboard
          </h1>

          <div className="flex items-end gap-3">
            <FilterField label="Organización">
              <Select
              disabled={!filtersEnabled}
              value={filters.organizationId}
              onValueChange={(value) => {
                  if (value !== null) {
                  setOrganization(value);
                  }
              }}
              >
                <SelectTrigger className="w-56 h-10 rounded-lg border-gray-300 text-sm">
                    <SelectValue placeholder="Seleccionar organización" />
                </SelectTrigger>

                <SelectContent>

                    {organizations.map(org => (

                        <SelectItem
                            key={org.id}
                            value={org.id}
                        >
                            {org.name}
                        </SelectItem>

                    ))}

                </SelectContent>

            </Select>
            </FilterField>

            <FilterField label="Cuenta AWS">
              <Select
              disabled={!filtersEnabled}
              value={filters.accountId ?? "all"}
              onValueChange={(value) => {
                  setAccount(value || "all");
              }}
              >
              <SelectTrigger className="w-56 h-10 rounded-lg border-gray-300 text-sm">
                  <SelectValue>
                  {selectedAccountName}
                  </SelectValue>
              </SelectTrigger>

              <SelectContent>

                  <SelectItem value="all">
                  Todas las cuentas
                  </SelectItem>

                  {accounts.map((account) => (
                  <SelectItem
                      key={account.id}
                      value={account.id}
                  >
                      {account.name}
                  </SelectItem>
                  ))}

              </SelectContent>

          </Select>
            </FilterField>

            <FilterField label="Región">
              <Select
              disabled={!filtersEnabled}
              value={filters.region}
              onValueChange={(value) => {
                  if (value) {
                  setRegion(value);
                  }
              }}
              >
                <SelectTrigger className="w-44 h-10 rounded-lg border-gray-300 text-sm">
                    <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>

                <SelectContent>

                    {regions.map(region => (

                        <SelectItem
                            key={region}
                            value={region}
                        >
                            {region}
                        </SelectItem>

                    ))}

                </SelectContent>

            </Select>
            </FilterField>

            {extraFilters}
          </div>

        </div>

        {/* Estado del cache */}
        <div className="pt-1 flex justify-end shrink-0">
            <CacheStatus />
        </div>

      </div>
    </header>
  );
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      {children}
    </div>
  );
}