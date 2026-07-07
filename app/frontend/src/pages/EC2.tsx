import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEc2Instances } from "@/services/ec2Service";
import type { EC2Instance } from "@/types/ec2";
import DataTable from "@/components/shared/DataTable";
import { useNavigate } from "react-router-dom";

export default function EC2() {
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInstances() {
      try {
        const data = await getEc2Instances();
        setInstances(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInstances();
  }, []);

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

      <Input
        placeholder="Search instance..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <DataTable
          data={filteredinstances}
          columns={instanceColumns}
          getRowKey={(instance) => instance.name}
          onRowClick={(instance) =>
              navigate(`/ec2/${instance.id}`)
          }
      /> 
    </div>
  );
}