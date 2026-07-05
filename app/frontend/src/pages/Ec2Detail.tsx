
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import InstanceInfoCard from "@/components/ec2/InstanceInfoCard";
import InstanceMetricsCard from "@/components/ec2/InstanceMetricsCard";
import MetricChart from "@/components/shared/MetricChart";
import { getEc2InstanceById } from "@/services/ec2Service";
import { useEffect, useState } from "react";
import type { EC2Instance } from "@/types/ec2";

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
        <InstanceInfoCard instance={instanceById} />
      )}

      {/* Seccion de métricas actuales---------------------------------------------------------------------------- */}
      {instanceById && (
        <InstanceMetricsCard
          cpu={instanceById.currentMetrics.cpu}
          ram={instanceById.currentMetrics.memory}
          disk={instanceById.currentMetrics.disk}
          network={instanceById.currentMetrics.network}
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
    </div>
  );
}