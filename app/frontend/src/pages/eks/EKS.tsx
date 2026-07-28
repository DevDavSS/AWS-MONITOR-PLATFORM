import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import EksTable from "@/components/eks/EksTable";
import type { EksCluster } from "@/types/eks";
import { useEffect, useState } from "react";
import { getEksClusters } from "@/services/eksService";
import { useFilters } from "@/contexts/FilterContext";
import Tabs from "@/components/shared/Tabs";
import AlertPanel from "@/components/alerts/AlertPanel";
import RulePanel from "@/components/rules/rulesPanel";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";


export default function EKS(){
    const [EksClusters, setEksClusters] = useState<EksCluster[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const { filters } = useFilters();

  // Atributos  a  mostrar en tabal de oonstancias para el creador de reglas
  const selectableResources: RuleSelectableResource[] =

      EksClusters.map(eksCluster => ({

          id: eksCluster.id,

          name: eksCluster.name,

          account: eksCluster.accountId,

          accountName: eksCluster.account,

          region: eksCluster.region

      }));
    /* Componente de pestañas dinámico */
    const tabs = [
    { id: "clusters", label: "Clusters" },
    { id: "alerts", label: "Alerts" },
    { id: "rules", label: "Rules" },

    ];
    const [activeTab, setActiveTab] = useState("clusters");

    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getEksClusters(filters);

        setEksClusters(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, [filters]);

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

    const clusters = EksClusters.length;
    const nodeGroups = EksClusters.reduce(
        (sum, cluster) => sum + cluster.nodeGroupCount,
        0
    );
    const nodes = EksClusters.reduce(
        (sum, cluster) => sum + cluster.nodeCount,
        0
    );
    const healthyClusters = EksClusters.filter(
        c => c.status === "ACTIVE"
    ).length; //Definir desde backend próximamente

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
            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === "clusters"&&(
                <>
                <Input
                    placeholder="Search Cluster..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
                <EksTable EksClusterId={filteredEksClusters}/>        
                </>
            )}
            {activeTab ===  "alerts" &&(
                <>
                <AlertPanel
                    service="eks"
                />
                </>
            )}
            {activeTab === "rules"&& (

                <>
            <RulePanel

                service="eks"

                resourceType="cluster"

                resources={selectableResources}

            />
                </>

            )}
        </div> 
    )
}