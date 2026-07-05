
import { useNavigate } from "react-router-dom";
import type { EksCluster } from "@/types/eks";

interface EksTableProps {
  EksClusterId: EksCluster[];
}

export default function EksTable({
  EksClusterId,
}: EksTableProps) {
    const navigate = useNavigate();
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Cluster</th>
            <th className="text-left p-3">Version</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Node Groups</th>
            <th className="text-left p-3">Nodes</th>
            <th className="text-left p-3">Organization</th>
            <th className="text-left p-3">Account</th>
            <th className="text-left p-3">Avg CPU</th>
            <th className="text-left p-3">Avg RAM</th>            
          </tr>
        </thead>

        <tbody>
          {EksClusterId.map((EksCluster) => (
            <tr
              key={EksCluster.id}
              className="border-b hover:bg-muted cursor-pointer"
              onClick={() => navigate(`/eks/${EksCluster.id}`)}
            >
              <td className="p-3">{EksCluster.name}</td>
              <td className="p-3">{EksCluster.version}</td>
              <td className="p-3">{EksCluster.status}</td>
              <td className="p-3">{EksCluster.nodeGroupCount}</td>
              <td className="p-3">{EksCluster.nodeCount}</td>
              <td className="p-3">{EksCluster.organization}</td>
              <td className="p-3">{EksCluster.account}</td>
              <td className="p-3">{EksCluster.avgCurrentMetrics.cpu.toFixed(1)}%</td>
              <td className="p-3">{EksCluster.avgCurrentMetrics.memory.toFixed(1)} Gb</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}