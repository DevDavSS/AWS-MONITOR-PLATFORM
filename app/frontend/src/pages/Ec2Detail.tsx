
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { instances } from "@/data/ec2";
import InstanceInfoCard from "@/components/ec2/InstanceInfoCard";
import InstanceMetricsCard from "@/components/ec2/InstanceMetricsCard";
import MetricChart from "@/components/ec2/MetricChart";


export default function Ec2Detail() {
  const navigate = useNavigate();

    const { instanceId } = useParams();

    const instance = instances.find(
    (item) => item.id === instanceId
    );

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
        {instance?.name} ({instance?.id})
      </h1>

      {instance && <InstanceInfoCard instance={instance} />}

      {/* Seccion de métricas actuales---------------------------------------------------------------------------- */}
      {instance && (
        <InstanceMetricsCard
          cpu={instance.currentMetrics.cpu}
          ram={instance.currentMetrics.memory}
          disk={instance.currentMetrics.disk}
          network={instance.currentMetrics.network}
        />
      )}
      {/* Seccion de gráficos historicos---------------------------------------------------------------------------- */}
      {/* En caso de necesitaragregar más gráficos solo usar elcomponente MetricChart una vez la informacion llegue estruturada por el backend */}
      <div className="grid grid-cols-2 gap-6">
        <MetricChart
          title="CPU Usage"
          data={instance?.historyMetrics.cpu || []}
        />

        <MetricChart
          title="Memory Usage"
          data={instance?.historyMetrics.memory || []}
        />

        <MetricChart
          title="Disk Usage"
          data={instance?.historyMetrics.disk || []}
        />

        <MetricChart
          title="Network Traffic"
          data={instance?.historyMetrics.network || []}
        />
      </div>
    </div>
  );
}