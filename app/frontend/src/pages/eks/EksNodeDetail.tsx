
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MetricsCard from "@/components/shared/CurrentMetricCard";
import MetricChart from "@/components/shared/MetricChart";
import { useEffect, useState } from "react";
import type { EC2Instance } from "@/types/ec2";
import Tabs from "@/components/shared/Tabs";
import InfoCard from "@/components/shared/InfoCard";
import { getEksNodeById } from "@/services/eksService";
import { useFilters } from "@/contexts/FilterContext";
import { useHeader } from "@/components/layout/HeaderContext";
import RulePanel from "@/components/rules/rulesPanel";


export default function EKSNode() {
  const navigate = useNavigate();

  const { instanceId} = useParams();
  const { EksClusterId} = useParams();
  const { EksNodeGroupId} = useParams();
  const { filters } = useFilters();
  const [instanceById, setInstance] = useState<EC2Instance | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monitoring");
  const { setFiltersEnabled } = useHeader();

  /* Desahabilitar filtros del encabezado */
  useEffect(() => {
    setFiltersEnabled(false);

    return () => {
      setFiltersEnabled(true);
    };
  }, []);

  useEffect(() => {
    async function loadInstanceById() {
      try {
      if (instanceId && EksClusterId && EksNodeGroupId) {
        const data = await getEksNodeById(EksClusterId,EksNodeGroupId,instanceId, filters);
        setInstance(data);
      }
      } catch (error) {
      console.error(error);
      } finally {
      setLoading(false);
      }
    }

    loadInstanceById();
  }, [EksClusterId,EksNodeGroupId,instanceId, filters])


    /* Metricas para el componente de Metricas actuales (monitoring tab)  */
    const metrics = [
    {
        label: "CPU",
        value: instanceById?.currentMetrics.cpu ?? 0,
        unit: "%",
    },
    {
        label: "Memory",
        value: instanceById?.currentMetrics.memory ?? 0,
        unit: "%",
    },
    {
        label: "Disk",
        value: instanceById?.currentMetrics.disk ?? 0,
        unit: "%",
    },
    {
        label: "Network",
        value: instanceById?.currentMetrics.network ?? 0,
        unit: "MB/s",
    },
    ];

    /* Campos de Card Info */
    const nodeFields = [
        {
            label: "Node Id",
            render: (node: EC2Instance) => node.id,
        },
        {
            label: "Name",
            render: (node: EC2Instance) => node.name,
        },
        {
            label: "Type",
            render: (node: EC2Instance) => node.type,
        },
        {
            label: "Status",
            render: (node: EC2Instance) => node.status,
        },
        {
            label: "ClaudWatch Agent",
            render: (node: EC2Instance) => node.cloudWatchAgent ? "true" : "false",
        },
    ]

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "rules", label: "Rules" },
    ];


    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    <div className="space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft size={18} />
        Node Group ({EksNodeGroupId}) 
      </button>

      <h1 className="text-3xl font-bold">
        {instanceById?.name} ({instanceById?.id}) (Node)
      </h1>

      {instanceById && (
        <InfoCard
          title="EKS Node Groups - Node Group Information"
          data={instanceById}
          fields={nodeFields}
        />
      )}

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === "monitoring" && (
        <>
          {/* Seccion de métricas actuales---------------------------------------------------------------------------- */}
          {instanceById && (
            <MetricsCard
                title="Current Metrics"
                metrics={metrics}
            />
          )}

        {/* Seccion de gráficos historicos---------------------------------------------------------------------------- */}
        {/* En caso de necesitar agregar más gráficos solo usar elcomponente MetricChart una vez la informacion llegue estruturada por el backend */}
        <div className="grid grid-cols-2 gap-6">
          <MetricChart
            title="CPU Usage"
            data={instanceById?.historyMetrics.cpu.map(item => ({ time: item.time, value: item.value })) || []}
          />

          <MetricChart
            title="Memory Usage"
            data={instanceById?.historyMetrics.memory.map(item => ({ time: item.time, value: item.value })) || []}
          />

          <MetricChart
            title="Disk Usage"
            data={instanceById?.historyMetrics.disk.map(item => ({ time: item.time, value: item.value })) || []}
          />

          <MetricChart
            title="Network Traffic"
            data={instanceById?.historyMetrics.network.map(item => ({ time: item.time, value: item.value })) || []}
          />
        </div>
        </>
        )}
        {activeTab === "rules" && instanceById && (

            <RulePanel

                service="eks"

                resourceType="node"
                
                resourceId={instanceById.id}

                resources={[
                    {
                        id: instanceById.id,
                        name: instanceById.name,
                        account: instanceById.accountId,
                        accountName: instanceById.account,
                        region: filters.region
                    }
                ]}

            />

        )}

    </div>
  );
}