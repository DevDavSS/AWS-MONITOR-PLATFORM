import { ArrowLeft } from "lucide-react"
import ResourceCard from "@/components/dashboard/ResourceCard";
import { useNavigate, useParams } from "react-router-dom"
import { getEksClustersById } from "@/services/eksService";
import { useState, useEffect } from "react";
import type { EksCluster, NodeGroup } from "@/types/eks";
import Tabs from "@/components/shared/Tabs";
import MetricChart from "@/components/shared/MetricChart";
import DataTable from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import MetricsCard from "@/components/shared/CurrentMetricCard";
import InfoCard from "@/components/shared/InfoCard";
import { useFilters } from "@/contexts/FilterContext";
import { useHeader } from "@/components/layout/HeaderContext";
import RulePanel from "@/components/rules/rulesPanel";

export default function EksDetail(){
    const navigate = useNavigate();
    const {EksClusterId} = useParams();

    const { setFiltersEnabled } = useHeader();
    const [search, setSearch] = useState("");
    /* Backend */
    const [eksCluesterById, setEksCluster] = useState<EksCluster | null>(null);
    const [loading, setLoading] = useState(true);

    const {filters,setEffectiveAccount} = useFilters();

    /* Desahabilitar filtros del encabezado */
    useEffect(() => {
      setFiltersEnabled(false);

      return () => {
        setFiltersEnabled(true);

        setEffectiveAccount("all");    
      };
    }, []);

    useEffect(() => {
        async function loadEksClusterById() {
        try {
        if (EksClusterId) {
            const data = await getEksClustersById(EksClusterId,filters);
            setEksCluster(data);
            setEffectiveAccount(data.accountId);
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
        }

        loadEksClusterById();
    }, [EksClusterId])
    
    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "compute", label: "Compute" },
    { id: "rules", label: "Rules" },
    ];
    const [activeTab, setActiveTab] = useState("monitoring");

    /* Filtros del buscador en tabla de node groups */
    const filteredNodeGroups =
    eksCluesterById?.nodeGroups.filter((nodeGroup) => {
        const text = [
        nodeGroup.name,
        nodeGroup.status,
        nodeGroup.instanceType,
        nodeGroup.desiredSize,
        nodeGroup.minSize,
        nodeGroup.maxSize,
        ]
        .map(String)
        .join(" ")
        .toLowerCase();

        return text.includes(search.trim().toLowerCase());
    }) ?? [];
    
    /* Metricas para el componente de Metricas actuales (monitoring tab)  */
    const metrics = [
    {
        label: "Avg CPU",
        value: eksCluesterById?.avgCurrentMetrics.cpu ?? 0,
        unit: "%",
    },
    {
        label: "Avg Memory",
        value: eksCluesterById?.avgCurrentMetrics.memory ?? 0,
        unit: "%",
    },
    {
        label: "Avg Disk",
        value: eksCluesterById?.avgCurrentMetrics.disk ?? 0,
        unit: "%",
    },
    {
        label: "Avg Network",
        value: eksCluesterById?.avgCurrentMetrics.network ?? 0,
        unit: "MB/s",
    },
    ];

    /*  Cluster fields for info Card component */
    const clusterFields = [
        {
            label: "Cluster Name",
            render: (cluster: EksCluster) => cluster.name,
        },
        {
            label: "Status",
            render: (cluster: EksCluster) => cluster.status,
        },
        {
            label: "Kubernetes Version",
            render: (cluster: EksCluster) => cluster.version,
        },
        {
            label: "Endpoint",
            render: (cluster: EksCluster) => cluster.endpoint,
        },
        {
            label: "Total Node Groups",
            render: (cluster: EksCluster) => cluster.nodeGroupCount,
        },
        {
            label: "Total Nodes",
            render: (cluster: EksCluster) => cluster.nodeCount,
        },
        {
            label: "Organization",
            render: (cluster: EksCluster) => cluster.organization,
        },
        {
            label: "Account",
            render: (cluster: EksCluster) => cluster.account,
        },
    ]


    /* Columnas para tabla de node groups */
    const nodeGroupColumns = [
        {
            key: "name",
            header: "Name",
            render: (nodeGroup: NodeGroup) => nodeGroup.name ?? "-",
        },
        {
            key: "status",
            header: "Status",
            render: (nodeGroup: NodeGroup) => nodeGroup.status ?? "-",
        },
        {
            key: "desired",
            header: "Desired",
            render: (nodeGroup: NodeGroup) => nodeGroup.desiredSize ?? "-",
        },
        {
            key: "min",
            header: "Min",
            render: (nodeGroup: NodeGroup) => nodeGroup.minSize ?? "-",
        },
        {
            key: "max",
            header: "Max",
            render: (nodeGroup: NodeGroup) => nodeGroup.maxSize ?? "-",
        },
        {
            key: "instanceType",
            header: "Instance Type",
            render: (nodeGroup: NodeGroup) => nodeGroup.instanceType ?? "-",
        },
    ]


    if (loading) {
        return <div>Loading...</div>;
    }

    return(
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm hover:underline"
            >
                <ArrowLeft size={18} />
                EKS Clusters
            </button>
            <h1 className="text-3xl font-bold">
                {eksCluesterById?.name} 
            </h1>

            {eksCluesterById && (
                <InfoCard
                    title="Cluster Information"
                    data={eksCluesterById}
                    fields={clusterFields}
                />
            )}

            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === "monitoring" && (
                <>
                    {/* Sección de métricas actuales */}
                    {eksCluesterById && (
                        <MetricsCard
                            title="Average Current Metrics (per Node Group)"
                            metrics={metrics}
                        />
                    )}
                    {/* Seccion de gráficos historicos---------------------------------------------------------------------------- */}
                    {/* En caso de necesitar agregar más gráficos solo usar elcomponente MetricChart una vez la informacion llegue estruturada por el backend */}
                    <div className="grid grid-cols-2 gap-6">
                        <MetricChart
                        title="CPU Usage"
                        data={eksCluesterById?.avgHistoryMetrics.cpu.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Memory Usage"
                        data={eksCluesterById?.avgHistoryMetrics.memory.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Disk Usage"
                        data={eksCluesterById?.avgHistoryMetrics.disk.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Network Traffic"
                        data={eksCluesterById?.avgHistoryMetrics.network.map(item => ({ time: item.time, value: item.value })) || []}
                        />
                    </div>
                </>
            )}

            {activeTab === "compute" && (
                <div>
                    <div className="grid grid-cols-4 gap-6 space-y-6">
                        <ResourceCard title="Node Groups" value={eksCluesterById?.nodeGroupCount ?? 0} />
                        <ResourceCard title="Nodes" value={eksCluesterById?.nodeCount ?? 0} />
                        <ResourceCard title="Desired" value={eksCluesterById?.totalDesired ?? 0} />
                        <ResourceCard title="Ready" value={eksCluesterById?.totalReady ?? 0} />        
                    </div>
                    <Input
                        placeholder="Search NodeGroup..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <DataTable
                        data={filteredNodeGroups}
                        columns={nodeGroupColumns}
                        getRowKey={(nodeGroup) => nodeGroup.name}
                        onRowClick={(nodeGroup) =>
                            navigate(`/eks/${eksCluesterById?.id}/nodeGroup/${nodeGroup.name}`)
                        }
                    />                        

                </div>
            
            )}
            {activeTab === "rules" && eksCluesterById && (

                <RulePanel

                    service="eks"

                    resourceType="cluster"

                    resourceId={eksCluesterById.id}

                    resources={[
                        {
                            id: eksCluesterById.id,
                            name: eksCluesterById.name,
                            account: eksCluesterById.accountId,
                            accountName: eksCluesterById.account,
                            region: filters.region
                        }
                    ]}

                />

            )}


        </div>
    )
}