import ResourceCard from "@/components/dashboard/ResourceCard";
import Ec2Table from "@/components/ec2/Ec2Table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEc2Instances } from "@/services/ec2Service";
import type { EC2Instance } from "@/types/ec2";

export default function EC2(){
    const [instances, setInstances] = useState<EC2Instance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getEc2Instances();

        setInstances(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, []);

    /*Uso de Datos de prueba */
    const instancesWithMetrics = instances.map((instance) => ({
    ...instance,
    cpu: 0,
    ram: 0,
    }));

    const running = instancesWithMetrics.filter(
    (instance) => instance.status === "Running"
    ).length;

    const stopped = instancesWithMetrics.filter(
    (instance) => instance.status === "Stopped"
    ).length;

    /*Estado para almacenar lo escrito en la barra de busqueda de los servidores */
    const [search, setSearch] = useState("");
    const filteredInstances = instancesWithMetrics.filter((instance) =>
    [
        instance.name,
        instance.id,
        instance.account,
        instance.type,
        instance.status,
    ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const total = instancesWithMetrics.length;
    if (loading) {
        return <div>Loading...</div>;
    }
    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
            EC2 Instances
            </h1>
    
            <div className="grid grid-cols-3 gap-6">
            <ResourceCard title="Running" value={running} />
            <ResourceCard title="Stopped" value={stopped} />
            <ResourceCard title="Total" value={total} />
            </div>
            <Input
                placeholder="Search instance..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />
            <Ec2Table instances={filteredInstances} />
        </div>
        
    );
}