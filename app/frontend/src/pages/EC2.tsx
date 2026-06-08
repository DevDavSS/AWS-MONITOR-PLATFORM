import ResourceCard from "@/components/dashboard/ResourceCard";
import Ec2Table from "@/components/ec2/Ec2Table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { instances } from "@/data/ec2";

export default function EC2(){
    /*Uso de Datos de prueba */
    const running = instances.filter(
    (instance) => instance.status === "Running"
    ).length;

    const stopped = instances.filter(
    (instance) => instance.status === "Stopped"
    ).length;

    /*Estado para almacenar lo escrito en la barra de busqueda de los servidores */
    const [search, setSearch] = useState("");
    const filteredInstances = instances.filter((instance) =>
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

    const total = instances.length;
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