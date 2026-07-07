import { DescribeNodegroupCommand } from "@aws-sdk/client-eks";
import { DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";
import { eksClient } from "../../aws/eksClient";
import { AutoScalingClient } from "@aws-sdk/client-auto-scaling";
import { getEc2InstancesAws } from "../ec2/ec2Service";

export const getNodesFromNodeGroup = async (
    clusterName: string,
    nodeGroupName: string
) => {
    const nodeGroup =
        await eksClient.send(
            new DescribeNodegroupCommand({
                    clusterName,
                    nodegroupName: nodeGroupName,
                })
        );
    const asgName =
        nodeGroup.nodegroup
            ?.resources
            ?.autoScalingGroups?.[0]
            ?.name;

    if (!asgName) {
        throw new Error("Auto Scaling Group name not found");
    }
    /* Uso de cliente de autoscaling para obtener sus atributos*/
    const autoScalingClient = new AutoScalingClient({});
    const response =
        await autoScalingClient.send(
            new DescribeAutoScalingGroupsCommand({
                AutoScalingGroupNames: [
                    asgName
                ]
            })
        );
    /*oBTENER IDs de los Nodos (instancias EC2) */
    const instanceIds =
        response.AutoScalingGroups?.[0]
            ?.Instances
            ?.map(
                i => i.InstanceId!
            ) ?? [];
    return getEc2InstancesAws(
        instanceIds
    )
}