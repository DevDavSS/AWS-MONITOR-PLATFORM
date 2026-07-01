import {
  DescribeInstancesCommand,
  Instance$,
} from "@aws-sdk/client-ec2";

import { ec2Client } from "../aws/ec2Client";
import { getCpuMetrics, getMemoryMetrics } from "./CloudWatchService";
import { getDiskUsageMetric } from "./CloudWatchService";
import { getNetworkTraffic } from "./CloudWatchService";

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


  return Promise.all(
    instances.map(async (instance) => {
      

      /*Get cpu mentrics from cloudwatch module */
      const cpu = await getCpuMetrics(
        instance.InstanceId!
      );
      /*Get Ram memory from cloudwatch module */
      const memory = await getMemoryMetrics(
        instance.InstanceId!
      );

      const disk = await getDiskUsageMetric(
        instance.InstanceId!
      );

      /* Get Network Traffic in MB from cloudwatch service module */
      const network = await getNetworkTraffic(
        instance.InstanceId!
      );

      return {
        id: instance.InstanceId ?? "",

        name: getTag(instance, "Name"),

        account: "",
        organization: "",

        type: instance.InstanceType ?? "",

        status: instance.State?.Name ?? "unknown",
        cloudWatchAgent: memory.hasAgent,
        
        currentMetrics: {
          cpu: cpu.current,
          memory: memory.current,
          disk: disk.current,
          network: network.current,
        },

        historyMetrics: {
          cpu: cpu.history,
          memory: memory.history,
          disk: disk.history,
          network: network.history,
        },


      };
    })
  );
};

//  {/* Servicio para fetchear instancias de EC2 al frontend, ruta local temporal*/} 
// export async function getEc2Instances() {
//   const response = await fetch(
//     "http://localhost:3000/api/ec2"
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Error fetching EC2 instances: ${response.statusText}`
//     );
//   }

//   return response.json();
// }

{/* Servicio para resolver backend de instancias por id */}
export const getEc2InstanceById = async (
  id: string
) => {
  const instances = await getEc2InstancesAws();

  return instances.find(
    instance => instance.id === id
  );

}