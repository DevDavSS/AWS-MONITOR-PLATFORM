import { DescribeNodegroupCommand } from "@aws-sdk/client-eks";
import { DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";
import { EksContext } from "../../../../types/services/awsConstext";
import { getEc2InstancesAws } from "../ec2/ec2Service";


export const getNodesFromNodeGroup = async (
    eksContext: EksContext,
    clusterName: string,
    nodeGroupName: string
) => {
    const nodeGroup =
        await eksContext.eksClient.send(
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
    //const autoScalingClient = new AutoScalingClient({});
    const response =
        await eksContext.autoScalingClient.send(
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
        eksContext,
        instanceIds
    )
}