import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MetricChart from "@/components/shared/MetricChart";
import { useEffect, useState } from "react";
import type { RdsDatabase } from "@/types/rds";
import { getRdsDatabasesById } from "@/services/rdsService";
import  DBInstanceInfoCard  from "@/components/rds/DBInstanceInfoCard" 
import DBInstanceMetricsCard from "@/components/rds/DBInstanceMetricsCard";
import Tabs from "@/components/shared/Tabs";
import { useFilters } from "@/contexts/FilterContext";
import { useHeader } from "@/components/layout/HeaderContext";
import RulePanel from "@/components/rules/rulesPanel";

export default function RdsDetail() {
    const navigate = useNavigate();

    const { DBinstanceId } = useParams();

    const [ DBinstanceById, setDBInstance] = useState<RdsDatabase | null>(null);
    const [loading, setLoading] = useState(true);
    const { setFiltersEnabled } = useHeader();
    const {filters,setEffectiveAccount} = useFilters();
    
    /* Desabilitar filtros de encabezado */
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
          if (DBinstanceId) {
            const data = await getRdsDatabasesById(DBinstanceId, filters);

            setDBInstance(data);

            // ← aquí
            setEffectiveAccount(data.accountId);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      loadInstanceById();
    }, [DBinstanceId]);
  
    const tabs = [
    { id: "monitoring", label: "Monitoring" },
    { id: "rules", label: "Rules" },
    ];
    const [activeTab, setActiveTab] = useState("monitoring");
    
    if (loading) {
        return (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando base de datos…
          </div>
        );
    }

    return(

        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Aurora RDS
            </button>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-mono">
            {DBinstanceById?.id} 
        </h1>

        {DBinstanceById && (
            <DBInstanceInfoCard DBinstance={DBinstanceById}/>
        )}
      {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
      <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
      />
    {activeTab === "monitoring" && (
      <>
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
      </>
    )}
      {activeTab === "rules" && DBinstanceById && (

          <RulePanel

              service="rds"

              resourceType="database"

              resourceId={DBinstanceById.id}

              resources={[
                  {
                      id: DBinstanceById.id,
                      name: DBinstanceById.dbIdentifier,
                      account: DBinstanceById.accountId,
                      accountName: DBinstanceById.account,
                      region: filters.region
                  }
              ]}

          />

      )}


    </div>
    );
}