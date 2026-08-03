import ResourceCard from "@/components/dashboard/ResourceCard";
{/*import { useHeader } from "@/components/layout/HeaderContext"; */}
import { Input } from "@/components/ui/input";
import type { RdsDatabase } from "@/types/rds";
import { getRdsDatabases } from "@/services/rdsService";
import { useEffect, useState } from "react";
import { useFilters } from "@/contexts/FilterContext";
import Tabs from "@/components/shared/Tabs";
import AlertPanel from "@/components/alerts/AlertPanel";
import RulePanel from "@/components/rules/rulesPanel";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import { Search, RefreshCw } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/shared/StatusBadge";


export default function RDS(){

    const [databases, setDatabases] = useState<RdsDatabase[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const {filters} = useFilters();
    const navigate = useNavigate();

    const tabs = [
    { id: "databases", label: "Databases" },
    { id: "alerts", label: "Alerts" },
    { id: "rules", label: "Rules" },
    ];
    const [activeTab, setActiveTab] = useState("databases");

    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getRdsDatabases(filters);

        setDatabases(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, [filters]);

    const databaseColumns = [
        {
            key: "dbIdentifier",
            header: "Identifier",
            render: (database: RdsDatabase) => (
                <span className="font-medium text-gray-900">{database.dbIdentifier ?? "-"}</span>
            ),
        },
        {
            key: "cluster",
            header: "Cluster",
            render: (database: RdsDatabase) => (
                <span className="font-mono text-xs text-gray-500">{database.clusterIdentifier ?? "-"}</span>
            ),
        },
        {
            key: "engine",
            header: "Engine",
            render: (database: RdsDatabase) => database.engine ?? "-",
        },
        {
            key: "size",
            header: "Size",
            render: (database: RdsDatabase) => (
                <span className="font-mono text-xs">{database.size ?? "-"}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (database: RdsDatabase) =>
                database.status ? <StatusBadge status={database.status} /> : "-",
        },
        {
            key: "role",
            header: "Role",
              render: (database: RdsDatabase) => (
                <span className="font-mono text-xs">{database.role ?? "-"}</span>
            ),

        },
        {
            key: "account",
            header: "Account",
            render: (database: RdsDatabase) => database.account ?? "-",
        },
        {
            key: "cpu",
            header: "CPU",
            render: (database: RdsDatabase) =>
                database.currentMetrics.cpu != null ? `${database.currentMetrics.cpu}%` : "-",

        },
        {
            key: "memory",
            header: "Memory",
            render: (database: RdsDatabase) =>
                database.currentMetrics.memory != null ? `${database.currentMetrics.memory}%` : "-",

        },
      ]
    // Atributos  a  mostrar en tabal de oonstancias para el creador de reglas
    const selectableResources: RuleSelectableResource[] =

        databases.map(database => ({

            id: database.id,

            name: database.dbIdentifier,

            accountName: database.account,

            account: database.accountId,

            region: database.region

        }));


    const filteredDatabases = databases.filter((database) =>
    [
      database.id,
      database.dbIdentifier,
      database.clusterIdentifier,
      database.engine,
      database.size,
   
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
    );
    const running = databases.filter(
        (i) => i.status === "available"
    ).length;

    const stopped = databases.filter(
        (i) => i.status === "Stopped"
    ).length;

    const total = databases.length;

    if (loading) {
        return (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando bases de datos…
          </div>
        );
    }

    return(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Aurora RDS Databases
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Bases de datos RDS de la organización y cuentas seleccionadas
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
            <ResourceCard title="Running" value={running} />
            <ResourceCard title="Stopped" value={stopped} />
            <ResourceCard title="Total" value={total} />
            </div>

            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === "databases" &&(
                <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar base de datos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-lg border-gray-300"
                    />
                </div>
            <DataTable
                data={filteredDatabases}
                columns={databaseColumns}
                getRowKey={(database) => database.id}
                onRowClick={(database) =>
                    navigate(`/rds/${database.id}`)
                }
                emptyMessage="No se encontraron instancias con esos filtros"
            />
                </div>
            )}
            {activeTab ===  "alerts" &&(
                <>
                <AlertPanel
                    service="rds"
                />
                </>
            )}
            {activeTab === "rules"&& (

                <>
            <RulePanel

                service="rds"

                resourceType="database"

                resources={selectableResources}

            />
                </>

            )}

        </div>
    );
}