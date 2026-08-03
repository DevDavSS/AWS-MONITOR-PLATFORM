import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import type { EksCluster } from "@/types/eks";
import { useEffect, useState } from "react";
import { getEksClusters } from "@/services/eksService";
import { useFilters } from "@/contexts/FilterContext";
import Tabs from "@/components/shared/Tabs";
import AlertPanel from "@/components/alerts/AlertPanel";
import RulePanel from "@/components/rules/rulesPanel";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import { Search, RefreshCw } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useNavigate } from "react-router-dom";

export default function EKS(){
    const [EksClusters, setEksClusters] = useState<EksCluster[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const { filters } = useFilters();
    const navigate = useNavigate();

  // Atributos  a  mostrar en tabal de oonstancias para el creador de reglas
  const selectableResources: RuleSelectableResource[] =

      EksClusters.map(eksCluster => ({

          id: eksCluster.id,

          name: eksCluster.name,

          account: eksCluster.accountId,

          accountName: eksCluster.account,

          region: eksCluster.region

      }));
    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "clusters", label: "Clusters" },
    { id: "alerts", label: "Alerts" },
    { id: "rules", label: "Rules" },

    ];
    const [activeTab, setActiveTab] = useState("clusters");

    /* Columnas para tabla de clusters */
    const clusterColumns = [
        {
            key: "cluster",
            header: "Cluster",
            render: (cluster: EksCluster) => (
                <span className="font-medium text-gray-900">{cluster.name ?? "-"}</span>
            ),
        },
        {
            key: "version",
            header: "Version",
            render: (cluster: EksCluster) => (
                <span className="font-mono text-xs text-gray-500">{cluster.version ?? "-"}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (cluster: EksCluster) =>
                cluster.status ? <StatusBadge status={cluster.status} /> : "-",
        },
        {
            key: "nodeGroups",
            header: "Node Groups",
            render: (cluster: EksCluster) => (
                <span className="font-mono text-xs">{cluster.nodeGroupCount ?? "-"}</span>
            ),
        },
        {
            key: "nodes",
            header: "Nodes",
            render: (cluster: EksCluster) => (
                <span className="font-mono text-xs">{cluster.nodeCount ?? "-"}</span>
            ),
        },
        {
            key: "organization",
            header: "Organization",
            render: (cluster: EksCluster) => (
                <span className="font-mono text-xs">{cluster.organization ?? "-"}</span>
            ),
        },
        {
            key: "account",
            header: "Account",
            render: (cluster: EksCluster) => (
                <span className="font-mono text-xs">{cluster.account ?? "-"}</span>
            ),
        },
        {
            key: "cpu",
            header: "CPU",
            render: (cluster: EksCluster) =>
                cluster.avgCurrentMetrics.cpu != null ? `${cluster.avgCurrentMetrics.cpu}%` : "-",

        },
        {
            key: "memory",
            header: "Memory",
            render: (cluster: EksCluster) =>
                cluster.avgCurrentMetrics.memory != null ? `${cluster.avgCurrentMetrics.memory}%` : "-",

        },
      ]


    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getEksClusters(filters);

        setEksClusters(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, [filters]);

    const filteredEksClusters = EksClusters.filter((cluster) =>
    [
      cluster.id,
      cluster.name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
    );

    const clusters = EksClusters.length;
    const nodeGroups = EksClusters.reduce(
        (sum, cluster) => sum + cluster.nodeGroupCount,
        0
    );
    const nodes = EksClusters.reduce(
        (sum, cluster) => sum + cluster.nodeCount,
        0
    );
    const healthyClusters = EksClusters.filter(
        c => c.status === "ACTIVE"
    ).length; //Definir desde backend próximamente

    if (loading) {
        return (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando clusters…
          </div>
        );
    }

    return( 
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Elastic Kubernetes Service
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Clusters EKS de la organización y cuentas seleccionadas
                </p>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <ResourceCard title="Clusters" value={clusters} />
                <ResourceCard title="Node Groups" value={nodeGroups} />
                <ResourceCard title="Nodes" value={nodes} />
                <ResourceCard title="Healthy Clusters" value={healthyClusters} />        
            </div>
            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === "clusters"&&(
                <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar cluster..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-lg border-gray-300"
                    />
                </div>
            <DataTable
                data={filteredEksClusters}
                columns={clusterColumns}
                getRowKey={(cluster) => cluster.id}
                onRowClick={(cluster) =>
                    navigate(`/eks/${cluster.id}`)
                }
                emptyMessage="No se encontraron clusters con esos filtros"
            />      
                </div>
            )}
            {activeTab ===  "alerts" &&(
                <>
                <AlertPanel
                    service="eks"
                />
                </>
            )}
            {activeTab === "rules"&& (

                <>
            <RulePanel

                service="eks"

                resourceType="cluster"

                resources={selectableResources}

            />
                </>

            )}
        </div> 
    )
}