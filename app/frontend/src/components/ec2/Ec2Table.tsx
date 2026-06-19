
import { useNavigate } from "react-router-dom";

interface Ec2Instance {
  id: string;
  name: string;
  account: string;
  type: string;
  status: string;
  cloudWatchAgent: boolean,
  cpu: number;
  ram: number;
}

interface Ec2TableProps {
  instances: Ec2Instance[];
}

export default function Ec2Table({
    
  instances,
}: Ec2TableProps) {
    const navigate = useNavigate();
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Instance ID</th>
            <th className="text-left p-3">Account</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Agent CW</th>
            <th className="text-left p-3">CPU</th>
            <th className="text-left p-3">RAM</th>
          </tr>
        </thead>

        <tbody>
          {instances.map((instance) => (
            <tr
              key={instance.id}
              className="border-b hover:bg-muted cursor-pointer"
              onClick={() => navigate(`/ec2/${instance.id}`)}
            >
              <td className="p-3">{instance.name}</td>
              <td className="p-3">{instance.id}</td>
              <td className="p-3">{instance.account}</td>
              <td className="p-3">{instance.type}</td>
              <td className="p-3">{instance.status}</td>
              <td className="p-3">{instance.cloudWatchAgent}</td>
              <td className="p-3">{instance.cpu}%</td>
              <td className="p-3">{instance.ram}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}