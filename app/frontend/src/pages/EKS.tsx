import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import EksTable from "@/components/eks/EksTable";
import type { EksCluster } from "@/types/eks";
import { useEffect, useState } from "react";
import { getEksClusters } from "@/services/eksService";

export default function EKS(){
    const [EksClusters, setEksClusters] = useState<EksCluster[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getEksClusters();

        setEksClusters(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, []);

    const filteredEksClusters = EksClusters.filter((cluster) =>
    [
      cluster.id,
      cluster.name,
      cluster.version,
      cluster.status,
      cluster.nodeGroupCount,
      cluster.nodeCount,
      cluster.organization,
      cluster.account,
      cluster.avgCurrentMetrics.cpu,
      cluster.avgCurrentMetrics.memory,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
    );
    const clusters = 5;
    const nodeGroups = 10;
    const nodes = 50;
    const healthyClusters = 4;

    if (loading) {
        return <div>Loading...</div>;
    }

    return( 
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Elastic Kubernetes Service</h1>
            <div className="grid grid-cols-4 gap-6">
                <ResourceCard title="Clusters" value={clusters} />
                <ResourceCard title="Node Groups" value={nodeGroups} />
                <ResourceCard title="Nodes" value={nodes} />
                <ResourceCard title="Healthy Clusters" value={healthyClusters} />        
            </div>
            <Input
                placeholder="Search Cluster..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />
            <EksTable EksClusterId={filteredEksClusters}/>

        </div> 
    )
}