import ResourceCard from "@/components/dashboard/ResourceCard";
{/*import { useHeader } from "@/components/layout/HeaderContext"; */}
import RdsTable from "@/components/rds/RdsTable";
import { Input } from "@/components/ui/input";
import type { RdsDatabase } from "@/types/rds";
import { getRdsDatabases } from "@/services/rdsService";
import { useEffect, useState } from "react";

export default function RDS(){

    const [databases, setDatabases] = useState<RdsDatabase[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
    async function loadInstances() {
        try {
        const data = await getRdsDatabases();

        setDatabases(data);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    loadInstances();
    }, []);

    const filteredDatabases = databases.filter((database) =>
    [
      database.id,
      database.dbIdentifier,
      database.clusterIdentifier,
      database.engine,
      database.size,
      database.status,
      database.organization,
      database.account
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
    );
    const running = databases.filter(
        (i) => i.status === "available"
    ).length;

    const stopped = databases.filter(
        (i) => i.status === "Stopped"
    ).length;

    const total = databases.length;

    if (loading) {
        return <div>Loading...</div>;
    }

    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
            Aurora RDS Databases
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
            <RdsTable DBIdentifiers={filteredDatabases}/>
        </div>
    );
}