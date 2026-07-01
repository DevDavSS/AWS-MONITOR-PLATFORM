import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";

export default function EKS(){
    const clusters = 5;
    const nodeGroups = 10;
    const nodes = 50;
    const healthyClusters = 4;
    return( 
        <div className="space-y-6">
            <h1>Elastic Kubernetes Service</h1>
            <div className="grid grid-cols-4 gap-6">
                <ResourceCard title="Clusters" value={clusters} />
                <ResourceCard title="Node Groups" value={nodeGroups} />
                <ResourceCard title="Nodes" value={nodes} />
                <ResourceCard title="Healthy Clusters" value={healthyClusters} />        
            </div>

            

        </div> 
    )
}