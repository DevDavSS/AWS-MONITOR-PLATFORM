
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "@/components/shared/MetricChart";
import { getEc2InstanceById } from "@/services/ec2Service";
import { useEffect, useState } from "react";
import type { EC2Instance } from "@/types/ec2";
import Tabs from "@/components/shared/Tabs";
import MetricsCard from "@/components/shared/CurrentMetricCard";
import InfoCard from "@/components/shared/InfoCard";

export default function Ec2Detail() {
    const navigate = useNavigate();

    const { instanceId } = useParams();

    const [instanceById, setInstance] = useState<EC2Instance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadInstanceById() {
        try {
        if (instanceId) {
          const data = await getEc2InstanceById(instanceId);
          setInstance(data);
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
      }

      loadInstanceById();
    }, [instanceId])

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "warnings", label: "Warnings" },
    ];
    const [activeTab, setActiveTab] = useState("monitoring");


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

    /* Instance fields for info Card component */
    const instanceFields = [
        {
            label: "Node Group name",
            render: (instance: EC2Instance) => instance.name,
        },
        {
            label: "Type",
            render: (instance: EC2Instance) => instance.type,
        },
        {
            label: "Instance Id",
            render: (instance: EC2Instance) => instance.id,
        },
        {
            label: "Status",
            render: (instance: EC2Instance) => instance.status,
        },
        {
            label: "Account",
            render: (instance: EC2Instance) => instance.account,
        },
        {
            label: "Organization",
            render: (instance: EC2Instance) => instance.organization,
        },
        {
            label: "CloudWatch Agent Enabled:",
            render: (instance: EC2Instance) => instance.cloudWatchAgent,
        },
    ]

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
        EC2 Instances
      </button>

      <h1 className="text-3xl font-bold">
        {instanceById?.name} ({instanceById?.id})
      </h1>

      {instanceById && (
            <InfoCard
                title="Instance Information"
                data={instanceById}
                fields={instanceFields}
            />
      )}

      {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
      <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
      />
      {activeTab === "monitoring" &&(
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

    </div>
  );
}