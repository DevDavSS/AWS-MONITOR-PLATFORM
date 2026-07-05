import type { EksCluster } from "@/types/eks";

interface EksClusterInfoCardProps {
  EksCluster: EksCluster;
}

export default function EksClusterInfoCard({
  EksCluster,
}: EksClusterInfoCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Elastic Kubernetes Service- Cluster Information
      </h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        <div>
          <span className="font-medium">Cluster Name:</span>{" "}
          {EksCluster.name}
        </div>

        <div>
          <span className="font-medium">Status:</span>{" "}
          {EksCluster.status}
        </div>

        <div>
          <span className="font-medium">Kubernetes Version:</span>{" "}
          {EksCluster.version}
        </div>

        <div>
          <span className="font-medium">Endpoint:</span>{" "}
          {EksCluster.endpoint}
        </div>

        <div>
          <span className="font-medium">Total Node Groups:</span>{" "}
          {EksCluster.nodeGroupCount}
        </div>

        <div>
          <span className="font-medium">Total Nodes:</span>{" "}
          {EksCluster.nodeCount}
        </div>

        <div>
          <span className="font-medium">Organization:</span>{" "}
          {EksCluster.organization}
        </div>

        <div>
          <span className="font-medium">Account:</span>{" "}
          {EksCluster.account}
        </div>

      </div>
    </div>
  );
}