import { ResourceSnapshot } from "../../../types/alert/ResurceSnapshot";
import { EC2Instance } from "../../../types/services/ec2";

export const mapEc2Snapshots = (
    instances: EC2Instance[]
): ResourceSnapshot[] => {

    return instances.map(instance => ({
        
        organizationId: instance.organization,

        accountId: instance.accountId,

        region: instance.region,

        service: "ec2",

        resourceType: "instance",

        resourceId: instance.id,

        resourceName: instance.name,

        metricas: {

            cpu: instance.currentMetrics.cpu,

            memory: instance.currentMetrics.memory,

            disk: instance.currentMetrics.disk,

            network: instance.currentMetrics.network,

        }

    }))

}