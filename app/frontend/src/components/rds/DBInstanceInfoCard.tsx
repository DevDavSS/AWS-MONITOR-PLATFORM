import type { RdsDatabase } from "@/types/rds";

interface DBInstanceInfoCardProps {
  DBinstance: RdsDatabase;
}

export default function DBInstanceInfoCard({
  DBinstance,
}: DBInstanceInfoCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Aurora RDS instance information
      </h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        <div>
          <span className="font-medium">DBIdentifier:</span>{" "}
          {DBinstance.dbIdentifier}
        </div>

        <div>
          <span className="font-medium">Cluster:</span>{" "}
          {DBinstance.clusterIdentifier}
        </div>

        <div>
          <span className="font-medium">Engine:</span>{" "}
          {DBinstance.engine}
        </div>

        <div>
          <span className="font-medium">Size:</span>{" "}
          {DBinstance.size}
        </div>

        <div>
          <span className="font-medium">Status:</span>{" "}
          {DBinstance.status}
        </div>

        <div>
          <span className="font-medium">Role:</span>{" "}
          {DBinstance.role}
        </div>

        <div>
          <span className="font-medium">Organization:</span>{" "}
          {DBinstance.organization}
        </div>

        <div>
          <span className="font-medium">Account:</span>{" "}
          {DBinstance.account}
        </div>

      </div>
    </div>
  );
}