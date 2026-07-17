import {ResourceSnapshot} from "../../types/alert/ResurceSnapshot"
import { getAllCache } from "../../cache/resourceCache"
import { mapEc2Snapshots } from "./mapper/ec2SnapshotMapper";
import { mapRdsSnapshots } from "./mapper/rdsSnapshotMapper";
import { mapEksSnapshots } from "./mapper/eksSnapshotMapper";
import { EC2Instance } from "../../types/services/ec2";
import { RdsDatabase } from "../../types/services/rds";
import { EksCluster } from "../../types/services/eks";

export const buildResourceSnapshots = async () => {
    const cache = getAllCache();

    const snapshots: ResourceSnapshot[] = [];

for (const [key, entry] of cache.entries()) {

    switch (true) {
        case key.startsWith("ec2:"):
            snapshots.push(
                ...mapEc2Snapshots(
                    entry.data as EC2Instance[]
                )
            );
        break;

        case key.startsWith("rds:"):
            snapshots.push(
                ...mapRdsSnapshots(
                    entry.data as RdsDatabase[]
                )
            );
        break;
        
        case key.startsWith("eks:"):
            snapshots.push(
                ...mapEksSnapshots(
                    entry.data as EksCluster[]
                )
            );
        break;
    }

}
    return snapshots
}