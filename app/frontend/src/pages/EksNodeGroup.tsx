import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react";
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
import { Input } from "@/components/ui/input";


export default function(){
    const navigate = useNavigate();
    const { EksClusterId, EksNodeGroupId } = useParams();
    const [search, setSearch] = useState("");

    /* Backend */
    const [eksNodeGroupById, setNodeGroup] = useState<NodeGroup | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNodeGroupById() {
        try {
        if (EksNodeGroupId && EksClusterId) {
            const data = await getEksNodeGroupById(EksClusterId,EksNodeGroupId);
            setNodeGroup(data);
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
        }

        loadNodeGroupById();
    }, [EksClusterId, EksNodeGroupId])

    /* Node Greoups fields for info Card component */
    const nodeGroupFields = [
        {
            label: "Node Group name",
            render: (nodeGroup: NodeGroup) => nodeGroup.name,
        },
        {
            label: "Status",
            render: (nodeGroup: NodeGroup) => nodeGroup.status,
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
            render: (nodeGroup: NodeGroup) => nodeGroup.instanceType,
        },
    ]

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "nodes", label: "Nodes" },
    { id: "warnings", label: "Warnings" },
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
        unit: "GB",
    },
    {
        label: "Avg Disk",
        value: eksNodeGroupById?.avgCurrentMetrics.disk ?? 0,
        unit: "GB",
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
            render: (node: EC2Instance) => node.name ?? "-",
        },
        {
            key: "status",
            header: "Status",
            render: (node: EC2Instance) => node.status ?? "-",
        },
        {
            key: "cwAgent",
            header: "CW Agent",
            render: (node: EC2Instance) => node.cloudWatchAgent ?? "-",
        },
        {
            key: "type",
            header: "Instance Type",
            render: (node: EC2Instance) => node.type ?? "-",
        },
        {
            key: "cpu",
            header: "Cpu",
            render: (node: EC2Instance) => node.currentMetrics.cpu ?? "-",
        },
        {
            key: "memory",
            header: "Memory",
            render: (node: EC2Instance) => node.currentMetrics.memory ?? "-",

        },
    ]
    {/* Nodos filtrados para DataTable y Barra de búsqueda */}
    const filteredNodes =
    eksNodeGroupById?.nodes.filter((node) => {
        const text = [
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
        return <div>Loading...</div>;
    }

    return(
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm hover:underline"
            >
                <ArrowLeft size={18} />
                EKS Cluster {EksClusterId}
            </button>
            <h1 className="text-3xl font-bold">
                {EksNodeGroupId} (NodeGroup) 
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
                <>
                <div className="grid grid-cols-4 gap-6 space-y-6">
                    <ResourceCard title="Desired" value={eksNodeGroupById?.desiredSize ?? 0} />
                    <ResourceCard title="Min Size" value={eksNodeGroupById?.minSize ?? 0} />
                    <ResourceCard title="Max Size" value={eksNodeGroupById?.maxSize ?? 0} />
                    <ResourceCard title="Total Nodes" value={eksNodeGroupById?.totalNodes ?? 0} />        
                </div>
                    <Input
                        placeholder="Search Nodes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <DataTable
                        data={filteredNodes}
                        columns={nodeColumns}
                        getRowKey={(node) => node.name}
                        // onRowClick={(node) =>
                        //     navigate(`/eks/${eksCluesterById?.id}/nodeGroup/${nodeGroup.name}`)
                        // }
                    />    
                </>
            )}

            {activeTab === "warnings" && (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                    Coming Soon
                </div>
            )}

        </div>
    )
}