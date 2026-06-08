
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { instances } from "@/data/ec2";

export default function Ec2Detail() {
  const navigate = useNavigate();

    const { instanceId } = useParams();

    const instance = instances.find(
    (item) => item.id === instanceId
    );

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft size={18} />
        EC2 Instances
      </button>

      <h1 className="text-3xl font-bold">
        {instance?.name} ({instance?.id})
      </h1>

    </div>
  );
}