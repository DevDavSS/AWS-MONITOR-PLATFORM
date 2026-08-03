import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "@/components/shared/MetricChart";
import { getEc2InstanceById } from "@/services/ec2Service";
import { useEffect, useState } from "react";
import type { EC2Instance } from "@/types/ec2";
import Tabs from "@/components/shared/Tabs";
import MetricsCard from "@/components/shared/CurrentMetricCard";
import InfoCard from "@/components/shared/InfoCard";
import { StatusBadge, BoolBadge } from "@/components/shared/StatusBadge";
import { useFilters } from "@/contexts/FilterContext";
import { useHeader } from "@/components/layout/HeaderContext";
import RulePanel from "@/components/rules/rulesPanel";
import { RefreshCw } from "lucide-react";

export default function Ec2Detail() {
    const navigate = useNavigate();
    const {filters,setEffectiveAccount} = useFilters();
    const { instanceId } = useParams();

    const { setFiltersEnabled } = useHeader();
    const [instanceById, setInstance] = useState<EC2Instance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setFiltersEnabled(false);

      return () => {
        setFiltersEnabled(true);

        setEffectiveAccount("all");
      };
    }, []);
    
  useEffect(() => {
      async function loadInstanceById() {
          try {

              if (!instanceId) return;
              const data = await getEc2InstanceById(
                  instanceId,
                  filters
              );

              setInstance(data);
              setEffectiveAccount(data.accountId);

          } catch (error) {
              console.error(error);
          } finally {

              setLoading(false);
          }
      }
      loadInstanceById();

  }, [instanceId]);

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "rules", label: "Rules" },
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
            label: "Name",
            render: (instance: EC2Instance) => instance.name,
        },
        {
            label: "Type",
            render: (instance: EC2Instance) => (
                <span className="font-mono text-sm">{instance.type}</span>
            ),
        },
        {
            label: "Instance Id",
            render: (instance: EC2Instance) => (
                <span className="font-mono text-sm">{instance.id}</span>
            ),
        },
        {
            label: "Status",
            render: (instance: EC2Instance) => <StatusBadge status={instance.status} />,
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
            label: "CloudWatch Agent Enabled",
            render: (instance: EC2Instance) => <BoolBadge value={instance.cloudWatchAgent} />,
        },
    ]

    if (loading) {
        return (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando instancia…
          </div>
        );
    }

  return (
    <div className="space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        EC2 Instances
      </button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {instanceById?.name}
        </h1>
        <p className="text-sm text-gray-400 font-mono mt-1">{instanceById?.id}</p>
      </div>

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
      {activeTab === "rules" && instanceById && (

          <RulePanel

              service="ec2"

              resourceType="instance"
              
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