import {
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";
import { awsBaseContext } from "../../types/awsConstext";
import { getCpuMetrics, getMemoryMetrics,getDiskUsageMetric, getNetworkTraffic } from "../cloudwatch/CloudWatchService";

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

/* Funcion reutilizable por el servicio de EKS para obtencion de Nodos, por eso recibe como parametro una lista de ids como string */
export const getEc2InstancesAws = async (
    context:awsBaseContext,
    instanceIds?: string[]
) => {

  const response = await context.ec2Client.send(
    new DescribeInstancesCommand({
      InstanceIds: instanceIds?.length
        ? instanceIds
        : undefined,
    })
  );

  const reservations =
    response.Reservations ?? [];

  const instances =
    reservations.flatMap(
      reservation => reservation.Instances ?? []
    );


  return Promise.all(
    instances.map(async (instance) => {
      

      /*Get cpu mentrics from cloudwatch module */
      const cpu = await getCpuMetrics(
        instance.InstanceId!,
        context.cloudWatchClient
      );
      /*Get Ram memory from cloudwatch module */
      const memory = await getMemoryMetrics(
        instance.InstanceId!,
        context.cloudWatchClient
      );

      const disk = await getDiskUsageMetric(
        instance.InstanceId!,
        context.cloudWatchClient
      );

      /* Get Network Traffic in MB from cloudwatch service module */
      const network = await getNetworkTraffic(
        instance.InstanceId!,
        context.cloudWatchClient
      );

      return {
        id: instance.InstanceId ?? "",

        name: getTag(instance, "Name"),

        account: context.accountName,
        accountId: context.accountId,
        organization: context.organizationId,

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


// export const getEc2InstanceById = async (
//   id: string,
//   context: awsBaseContext
// ) => {
//   const instances = 
//     await getEc2InstancesAws(
//       context
//     );

//   return instances.find(
//     instance => instance.id === id
//   );

// }