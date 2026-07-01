import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "@/components/shared/MetricChart";
import { useEffect, useState } from "react";
import type { RdsDatabase } from "@/types/rds";
import { getRdsDatabasesById } from "@/services/rdsService";
import  DBInstanceInfoCard  from "@/components/rds/DBInstanceInfoCard" 
import DBInstanceMetricsCard from "@/components/rds/DBInstanceMetricsCard";

export default function RdsDetail() {
    const navigate = useNavigate();

    const { DBinstanceId } = useParams();

    const [ DBinstanceById, setDBInstance] = useState<RdsDatabase | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadInstanceById() {
        try {
        if (DBinstanceId) {
          const data = await getRdsDatabasesById(DBinstanceId);
          setDBInstance(data);
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
      }

      loadInstanceById();
    }, [DBinstanceId])

    if (loading) {
        return <div>Loading...</div>;
    }

    return(

        <div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm hover:underline"
            >
                <ArrowLeft size={18} />
                Aurora RDS
            </button>

        <h1 className="text-3xl font-bold">
            {DBinstanceById?.id} 
        </h1>

        {DBinstanceById && (
            <DBInstanceInfoCard DBinstance={DBinstanceById}/>
        )}
      {/* Seccion de métricas actuales---------------------------------------------------------------------------- */}
      {DBinstanceById && (
        <DBInstanceMetricsCard
          cpu={DBinstanceById.currentMetrics.cpu}
          memory={DBinstanceById.currentMetrics.memory}
          connections={DBinstanceById.currentMetrics.connections}
          networkIn={DBinstanceById.currentMetrics.networkIn}
          networkOut={DBinstanceById.currentMetrics.networkOut}
          readIops={DBinstanceById.currentMetrics.readIops}
          writeIops={DBinstanceById.currentMetrics.writeIops}
          readThroughput={DBinstanceById.currentMetrics.readThroughput}
          writeThroughput={DBinstanceById.currentMetrics.writeThroughput}
          readLatency={DBinstanceById.currentMetrics.readLatency}
          writeLatency={DBinstanceById.currentMetrics.writeLatency}
          commitThroughput={DBinstanceById.currentMetrics.commitThroughput}
          selectThroughput={DBinstanceById.currentMetrics.selectThroughput}

        />
      )}
      {/* Seccion de gráficos historicos---------------------------------------------------------------------------- */}
      {/* En caso de necesitar agregar más gráficos solo usar elcomponente MetricChart una vez la informacion llegue estruturada por el backend */}
      <div className="grid grid-cols-2 gap-6">
        <MetricChart
          title="CPU Usage"
          data={DBinstanceById?.historyMetrics.cpu.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Memory Usage"
          data={DBinstanceById?.historyMetrics.memory.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Connections"
          data={DBinstanceById?.historyMetrics.connections.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Network IN"
          data={DBinstanceById?.historyMetrics.networkIn.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Network Out"
          data={DBinstanceById?.historyMetrics.networkOut.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Read IOPS"
          data={DBinstanceById?.historyMetrics.readIops.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Write IOPS"
          data={DBinstanceById?.historyMetrics.writeIops.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Read Throughput"
          data={DBinstanceById?.historyMetrics.readThroughput.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Write Throughput"
          data={DBinstanceById?.historyMetrics.writeThroughput.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Read Latency"
          data={DBinstanceById?.historyMetrics.readLatency.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Write Latency"
          data={DBinstanceById?.historyMetrics.writeLatency.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Commit Throughput"
          data={DBinstanceById?.historyMetrics.commitThroughput.map(item => ({ time: item.time, value: item.value })) || []}
        />

        <MetricChart
          title="Select Throughput"
          data={DBinstanceById?.historyMetrics.selectThroughput.map(item => ({ time: item.time, value: item.value })) || []}
        /> 
      </div>

        </div>
    );
}