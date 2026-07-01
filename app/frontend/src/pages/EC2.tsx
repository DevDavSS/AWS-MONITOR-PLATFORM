import ResourceCard from "@/components/dashboard/ResourceCard";
import Ec2Table from "@/components/ec2/Ec2Table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEc2Instances } from "@/services/ec2Service";
import type { EC2Instance } from "@/types/ec2";

export default function EC2() {
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredInstances = instances.filter((instance) =>
    [
      instance.name,
      instance.id,
      instance.account,
      instance.type,
      instance.status,
      instance.cloudWatchAgent ? "true" : "false",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      <Ec2Table instances={filteredInstances} />
    </div>
  );
}