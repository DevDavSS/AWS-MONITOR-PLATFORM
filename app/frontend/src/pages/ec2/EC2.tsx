import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEc2Instances } from "@/services/ec2Service";
import type { EC2Instance } from "@/types/ec2";
import DataTable from "@/components/shared/DataTable";
import { useNavigate } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import Tabs from "@/components/shared/Tabs";
import AlertPanel from "@/components/alerts/AlertPanel";
import RulePanel from "@/components/rules/rulesPanel";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";

export default function EC2() {
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { filters } = useFilters();


  useEffect(() => {
    async function loadInstances() {
      try {
        const data = await getEc2Instances(filters);
        setInstances(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInstances();
  }, [filters]);

  // Atributos  a  mostrar en tabal de oonstancias para el creador de reglas
  const selectableResources: RuleSelectableResource[] =

      instances.map(instance => ({

          id: instance.id,

          name: instance.name,

          account: instance.accountId,

          accountName: instance.account,

          region: instance.region

      }));

    {/* instancia filtrados para DataTable y Barra de búsqueda */}
    const filteredinstances =
    instances?.filter((instance) => {
        const text = [
        instance.name,
        instance.id,
        instance.account,
        instance.type,
        ]
        .map(String)
        .join(" ")
        .toLowerCase();

        return text.includes(search.trim().toLowerCase());
    }) ?? [];

    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "instances", label: "Instances" },
    { id: "alerts", label: "Alerts" },
    { id: "rules", label: "Rules" },
    ];
    const [activeTab, setActiveTab] = useState("instances");

    /* Columnas para tabla de instancias */
    const instanceColumns = [
        {
            key: "name",
            header: "Name",
            render: (instance: EC2Instance) => instance.name ?? "-",
        },
        {
            key: "id",
            header: "Instance ID",
            render: (instance: EC2Instance) => instance.id ?? "-",
        },
        {
            key: "account",
            header: "Account",
            render: (instance: EC2Instance) => instance.account ?? "-",
        },
        {
            key: "type",
            header: "Type",
            render: (instance: EC2Instance) => instance.type ?? "-",
        },
        {
            key: "status",
            header: "Status",
            render: (instance: EC2Instance) => instance.status ?? "-",
        },
        {
            key: "agentcw",
            header: "Agent CW",
            render: (instance: EC2Instance) => instance.cloudWatchAgent ? "true" : "false",

        },
        {
            key: "cpu",
            header: "CPU",
            render: (instance: EC2Instance) => instance.currentMetrics.cpu ?? "-",

        },
        {
            key: "memory",
            header: "Memory",
            render: (instance: EC2Instance) => instance.currentMetrics.memory ?? "-",

        },
      ]

  const running = instances.filter(
    (i) => i.status === "running"
  ).length;

  const stopped = instances.filter(
    (i) => i.status === "stopped"
  ).length;

  const total = instances.length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">EC2 Instances</h1>

      <div className="grid grid-cols-3 gap-6">
        <ResourceCard title="Running" value={running} />
        <ResourceCard title="Stopped" value={stopped} />
        <ResourceCard title="Total" value={total} />
      </div>

      {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
      <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
      />
      {activeTab ===  "instances" &&(
        <>
        <Input
          placeholder="Search instance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <DataTable
            data={filteredinstances}
            columns={instanceColumns}
            getRowKey={(instance) => instance.id}
            onRowClick={(instance) =>
                navigate(`/ec2/${instance.id}`)
            }
        /> 
        </>
      )}
      {activeTab ===  "alerts" &&(
        <>
          <AlertPanel
              service="ec2"
          />
        </>
      )}
      {activeTab === "rules"&& (

        <>
      <RulePanel

          service="ec2"

          resourceType="instance"

          resources={selectableResources}

      />
        </>

      )}

    </div>
  );
}