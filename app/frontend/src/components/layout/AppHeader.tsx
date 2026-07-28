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
    <header className="border-b px-6 py-4">
    <div className="flex items-start justify-between gap-4">



        {/* Título + Filtros */}
        <div className="flex flex-col gap-2">

          <h1 className="text-2xl font-bold">
            AWS PROD Monitoring Dashboard 
          </h1>

          <div className="flex gap-4">
            <Select
            disabled={!filtersEnabled}
            value={filters.organizationId}
            onValueChange={(value) => {
                if (value !== null) {
                setOrganization(value);
                }
            }}
            >
              <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select Organization" />
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
          
            <Select
            disabled={!filtersEnabled}
            value={filters.accountId ?? "all"}
            onValueChange={(value) => {
                setAccount(value || "all");
            }}
            >
            <SelectTrigger className="w-56">
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

            <Select
            disabled={!filtersEnabled}
            value={filters.region}
            onValueChange={(value) => {
                if (value) {
                setRegion(value);
                }
            }}
            >
              <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Region" />
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
            {extraFilters}
          </div>

        </div>

        {/* Estado del cache */}
        <div className="pt-2 flex justify-end">
            <CacheStatus />
        </div>

      </div>
    </header>
  );
}