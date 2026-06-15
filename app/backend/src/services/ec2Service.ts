import {
  DescribeInstancesCommand,
  Instance$,
} from "@aws-sdk/client-ec2";

import { ec2Client } from "../aws/ec2Client";

function getTag(
  instance: any,
  key: string
) {
  return (
    instance.Tags?.find(
      (tag: any) => tag.Key === key
    )?.Value ?? ""
  );
}

export const getEc2InstancesAws = async () => {

  const response = await ec2Client.send(
    new DescribeInstancesCommand({})
  );

  const reservations = response.Reservations ?? [];

  const instances = reservations.flatMap(
    reservation => reservation.Instances ?? []
  );

  return instances.map(instance => ({
    id: instance.InstanceId ?? "",

    name: getTag(instance, "Name"),

    account: "",
    organization: "",

    type: instance.InstanceType ?? "",

    status: instance.State?.Name ?? "unknown",

    currentMetrics: {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
    },

    historyMetrics: {
      cpu: [],
      memory: [],
      disk: [],
      network: [],
    },
  }));
};

 {/* Servicio para fetchear instancias de EC2 al frontend, ruta local temporal*/} 
export async function getEc2Instances() {
  const response = await fetch(
    "http://localhost:3000/api/ec2"
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching EC2 instances: ${response.statusText}`
    );
  }

  return response.json();
}

{/* Servicio para resolver backend de instancias por id */}
export const getEc2InstanceById = async (
  id: string
) => {
  const instances = await getEc2InstancesAws();

  return instances.find(
    instance => instance.id === id
  );

}