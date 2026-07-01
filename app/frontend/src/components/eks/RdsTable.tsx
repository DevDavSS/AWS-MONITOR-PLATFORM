
import { useNavigate } from "react-router-dom";
import type { RdsDatabase } from "@/types/rds";

interface RdsTableProps {
  DBIdentifiers: RdsDatabase[];
}

export default function RdsTable({
    
  DBIdentifiers,
}: RdsTableProps) {
    const navigate = useNavigate();
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">DBIdentifier</th>
            <th className="text-left p-3">Cluster</th>
            <th className="text-left p-3">Engine</th>
            <th className="text-left p-3">Size</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Organization</th>
            <th className="text-left p-3">Account</th>
            <th className="text-left p-3">CPU</th>
            <th className="text-left p-3">Memory</th>
            
          </tr>
        </thead>

        <tbody>
          {DBIdentifiers.map((dbIdentifier) => (
            <tr
              key={dbIdentifier.id}
              className="border-b hover:bg-muted cursor-pointer"
              onClick={() => navigate(`/rds/${dbIdentifier.id}`)}
            >
              <td className="p-3">{dbIdentifier.dbIdentifier}</td>
              <td className="p-3">{dbIdentifier.clusterIdentifier}</td>
              <td className="p-3">{dbIdentifier.engine}</td>
              <td className="p-3">{dbIdentifier.size}</td>
              <td className="p-3">{dbIdentifier.status}</td>
              <td className="p-3">{dbIdentifier.role}</td>
              <td className="p-3">{dbIdentifier.organization}</td>
              <td className="p-3">{dbIdentifier.account}</td>
              <td className="p-3">{dbIdentifier.currentMetrics.cpu.toFixed(1)}%</td>
              <td className="p-3">{dbIdentifier.currentMetrics.memory.toFixed(1)} Gb</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}