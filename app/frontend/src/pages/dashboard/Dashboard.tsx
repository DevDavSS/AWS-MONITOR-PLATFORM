import ResourceCard from "@/components/dashboard/ResourceCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <ResourceCard title="EC2" value={84} />
        <ResourceCard title="EKS" value={6} />
        <ResourceCard title="RDS" value={14} />
      </div>
    </div>
  );
}