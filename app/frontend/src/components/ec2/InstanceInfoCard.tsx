interface InstanceInfoCardProps {
  instance: {
    id: string;
    name: string;
    account: string;
    organization: string;
    type: string;
    status: string;
  };
}

export default function InstanceInfoCard({
  instance,
}: InstanceInfoCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Instance Information
      </h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        <div>
          <span className="font-medium">Name:</span>{" "}
          {instance.name}
        </div>

        <div>
          <span className="font-medium">Type:</span>{" "}
          {instance.type}
        </div>

        <div>
          <span className="font-medium">Instance ID:</span>{" "}
          {instance.id}
        </div>

        <div>
          <span className="font-medium">Status:</span>{" "}
          {instance.status}
        </div>

        <div>
          <span className="font-medium">Account:</span>{" "}
          {instance.account}
        </div>

        <div>
          <span className="font-medium">Organization:</span>{" "}
          {instance.organization}
        </div>
      </div>
    </div>
  );
}