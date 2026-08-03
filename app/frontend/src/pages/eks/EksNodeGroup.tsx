import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getEksNodeGroupById } from "@/services/eksService";
import type { NodeGroup } from "@/types/eks";
import type { EC2Instance } from "@/types/ec2";
import Tabs from "@/components/shared/Tabs";
import InfoCard from "@/components/shared/InfoCard";
import MetricsCard from "@/components/shared/CurrentMetricCard";
import MetricChart from "@/components/shared/MetricChart";
import ResourceCard from "@/components/dashboard/ResourceCard";
import DataTable from "@/components/shared/DataTable";
import { StatusBadge, BoolBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/contexts/FilterContext";
import { useHeader } from "@/components/layout/HeaderContext";
import RulePanel from "@/components/rules/rulesPanel";


export default function(){
    const navigate = useNavigate();
    const { EksClusterId, EksNodeGroupId } = useParams();
    const [search, setSearch] = useState("");
    const { filters } = useFilters();
    const { setFiltersEnabled } = useHeader();

    /* Backend */
    const [eksNodeGroupById, setNodeGroup] = useState<NodeGroup | null>(null);
    const [loading, setLoading] = useState(true);
    
    /* Desahabilitar filtros del encabezado */
    useEffect(() => {
      setFiltersEnabled(false);

      return () => {
        setFiltersEnabled(true);
      };
    }, []);

    useEffect(() => {
        async function loadNodeGroupById() {
        try {
        if (EksNodeGroupId && EksClusterId) {
            const data = await getEksNodeGroupById(EksClusterId,EksNodeGroupId, filters);
            setNodeGroup(data);
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
        }

        loadNodeGroupById();
    }, [EksClusterId, EksNodeGroupId, filters])

    /* Node Greoups fields for info Card component */
    const nodeGroupFields = [
        {
            label: "Node Group name",
            render: (nodeGroup: NodeGroup) => nodeGroup.name,
        },
        {
            label: "Status",
            render: (nodeGroup: NodeGroup) => <StatusBadge status={nodeGroup.status} />,
        },
        {
            label: "Desired Size",
            render: (nodeGroup: NodeGroup) => nodeGroup.desiredSize,
        },
        {
            label: "Min Size",
            render: (nodeGroup: NodeGroup) => nodeGroup.minSize,
        },
        {
            label: "Max Size",
            render: (nodeGroup: NodeGroup) => nodeGroup.maxSize,
        },
        {
            label: "Instance Type",
            render: (nodeGroup: NodeGroup) => (
                <span className="font-mono text-sm">{nodeGroup.instanceType}</span>
            ),
        },
    ]

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "nodes", label: "Nodes" },
    { id: "rules", label: "Rules" },
    ];
    const [activeTab, setActiveTab] = useState("monitoring");

    /* Metricas para el componente de Metricas actuales (monitoring tab)  */
    const metrics = [
    {
        label: "Avg CPU",
        value: eksNodeGroupById?.avgCurrentMetrics.cpu ?? 0,
        unit: "%",
    },
    {
        label: "Avg Memory",
        value: eksNodeGroupById?.avgCurrentMetrics.memory ?? 0,
        unit: "%",
    },
    {
        label: "Avg Disk",
        value: eksNodeGroupById?.avgCurrentMetrics.disk ?? 0,
        unit: "%",
    },
    {
        label: "Avg Network",
        value: eksNodeGroupById?.avgCurrentMetrics.network ?? 0,
        unit: "MB/s",
    },
    ];

    /* Columnas para tabla de Nodos */
    const nodeColumns = [
        {
            key: "name",
            header: "Name",
            render: (node: EC2Instance) => (
                <span className="font-medium text-gray-900">{node.name ?? "-"}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (node: EC2Instance) =>
                node.status ? <StatusBadge status={node.status} /> : "-",
        },
        {
            key: "cwAgent",
            header: "CW Agent",
            render: (node: EC2Instance) => <BoolBadge value={node.cloudWatchAgent} />,
        },
        {
            key: "type",
            header: "Instance Type",
            render: (node: EC2Instance) => (
                <span className="font-mono text-xs">{node.type ?? "-"}</span>
            ),
        },
        {
            key: "cpu",
            header: "Cpu",
            percentage: (node: EC2Instance) => node.currentMetrics.cpu,
            render: (node: EC2Instance) => <span>{node.currentMetrics.cpu}%</span>,
        },
        {
            key: "memory",
            header: "Memory",
            percentage: (node: EC2Instance) => node.currentMetrics.memory,
            render: (node: EC2Instance) => <span>{node.currentMetrics.memory}%</span>,
        },
    ]
    {/* Nodos filtrados para DataTable y Barra de búsqueda */}
    const filteredNodes =
    eksNodeGroupById?.nodes.filter((node) => {
        const text = [
        node.id,
        node.name,
        node.status,
        node.type,
        node.cloudWatchAgent,
        ]
        .map(String)
        .join(" ")
        .toLowerCase();

        return text.includes(search.trim().toLowerCase());
    }) ?? [];


    /* Pantalla de carga */
    if (loading || !eksNodeGroupById){
        return (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando node group…
          </div>
        );
    }
    console.log(eksNodeGroupById.accountId)
    return(
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                EKS Cluster {EksClusterId}
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {EksNodeGroupId} <span className="text-gray-400 font-normal">(Node Group)</span>
            </h1>
            <InfoCard
                title="EKS Node Groups - Node Group Information"
                data={eksNodeGroupById}
                fields={nodeGroupFields}
            />
            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === "monitoring" && (
                <>
                    {/* Sección de métricas actuales */}
                        <MetricsCard
                            title="Average Current Metrics (per Node Group)"
                            metrics={metrics}
                        />
                    {/* Seccion de gráficos historicos---------------------------------------------------------------------------- */}
                    {/* En caso de necesitar agregar más gráficos solo usar elcomponente MetricChart una vez la informacion llegue estruturada por el backend */}
                    <div className="grid grid-cols-2 gap-6">
                        <MetricChart
                        title="Average CPU Usage"
                        data={eksNodeGroupById?.avgHistoryMetrics?.cpu?.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Average Memory Usage"
                        data={eksNodeGroupById?.avgHistoryMetrics?.memory?.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Average Disk Usage"
                        data={eksNodeGroupById?.avgHistoryMetrics?.disk?.map(item => ({ time: item.time, value: item.value })) || []}
                        />

                        <MetricChart
                        title="Average Network Traffic"
                        data={eksNodeGroupById?.avgHistoryMetrics?.network?.map(item => ({ time: item.time, value: item.value })) || []}
                        />
                    </div>
                </>

            )}
            
            {activeTab === "nodes" && (
                <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                    <ResourceCard title="Desired" value={eksNodeGroupById?.desiredSize ?? 0} />
                    <ResourceCard title="Min Size" value={eksNodeGroupById?.minSize ?? 0} />
                    <ResourceCard title="Max Size" value={eksNodeGroupById?.maxSize ?? 0} />
                    <ResourceCard title="Total Nodes" value={eksNodeGroupById?.totalNodes ?? 0} />        
                </div>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar nodo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 rounded-lg border-gray-300"
                        />
                    </div>
                    <DataTable
                        data={filteredNodes}
                        columns={nodeColumns}
                        getRowKey={(node) => node.id}
                        onRowClick={(node) =>
                            navigate(`/eks/${EksClusterId}/nodeGroup/${eksNodeGroupById.name}/node/${node.id}`)
                        }
                    />    
                </div>
            )}
            
            {activeTab === "rules" && eksNodeGroupById && (

                <RulePanel

                    service="eks"

                    resourceType="nodegroup"

                    resourceId={eksNodeGroupById.name}

                    resources={[
                        {
                            id: eksNodeGroupById.name!,
                            name: eksNodeGroupById.name,
                            account: eksNodeGroupById.accountId,
                            accountName: eksNodeGroupById.accountName,
                            region: filters.region
                        }
                    ]}

                />

            )}

        </div>
    )
}