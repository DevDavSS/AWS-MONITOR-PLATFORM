import Tabs from "../shared/Tabs";
import { useEffect,useState } from "react";
import { Input } from "@/components/ui/input";
import type { Alert } from "@/types/Alert";
import { useFilters } from "@/contexts/FilterContext";
import DataTable from "../shared/DataTable";
import { getAlerts } from "@/services/alertService";
import { AlertDetailModal } from "./Cd-AlertDetailModal";

interface AlertPanelProps {
    service: "ec2" | "eks" | "rds";
}


export default function AlertPanel({

    service

}: AlertPanelProps) {

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [search, setSearch] = useState("");
    const { filters } = useFilters(); //filtros generales de org,cuenta y region

    // alerta seleccionada para el modal de detalle (null = modal cerrado)
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    /* Componente de pestañas dinámico */
    const tabs = [
        {id: "active",label: "Active"},
        {id: "history",label: "History"}
    ];

    const [activeTab, setActiveTab] =
        useState("active");


    useEffect(() => {

        async function loadAlerts() {

            try {

                const data = await getAlerts({
                    service,
                    organizationId: filters.organizationId,
                    accountId: filters.accountId,
                    region: filters.region,
                    state:
                        activeTab === "active"
                            ? "ACTIVE"
                            : "RESOLVED"

                });
                setAlerts(data);

            } catch (error) {
                console.error(error);
            }
        }
        loadAlerts();
    }, [service,filters,activeTab]);



    /* Columnas para tabla de instancias */
    const alertColumns = [
        {
            key: "state",
            header: "State",
            render: (alert: Alert) => alert.state ?? "-",
        },
        {
            key: "resourceName",
            header: "Resource Name",
            render: (alert: Alert) => alert.resourceName ?? "-",
        },
        {
            key: "resourceType",
            header: "Resource Type",
            render: (alert: Alert) => alert.resourceType ?? "-",
        },
        {
            key: "resourceId",
            header: "Resource Id",
            render: (alert: Alert) => alert.resourceId ?? "-",
        },
        {
            key: "organizationId",
            header: "Organization",
            render: (alert: Alert) => alert.organizationId ?? "-",
        },
        {
            key: "accountId",
            header: "Account Id",
            render: (alert: Alert) => alert.accountId ?? "-",
        },
        {
            key: "region",
            header: "Region",
            render: (alert: Alert) => alert.region ?? "-",

        },
        {
            key: "createdAt",
            header: "Created At",
            render: (alert: Alert) =>
                alert.createdAt ? alert.createdAt.toString() : "-",

        },
        {
            key: "resolvedAt",
            header: "Resolved At",
            render: (alert: Alert) =>
                alert.createdAt ? alert.resolvedAt?.toString() : "Not Resolved",

        },
      ]

    {/* instancia filtrados para DataTable y Barra de búsqueda */}
    const filterAlert =
    alerts?.filter((alert) => {
        const text = [
            alert.resourceId,
            alert.resourceName,
            alert.resourceType,
            alert.metric,
            alert.id,
        ]
        .map(String)
        .join(" ")
        .toLowerCase();

        return text.includes(search.trim().toLowerCase());
    }) ?? [];



    return(
        <div className="space-y-6">
            {/* Selector de pestañas, y rednerizado segun pestaña seleccionada */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {activeTab === "active" &&(
                <>
                <h2>Active Alerts</h2>
                <Input
                placeholder="Instance Id or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                />

            <DataTable
                data={filterAlert}
                columns={alertColumns}
                getRowKey={(alert) => alert.id}
                onRowClick={(alert) => setSelectedAlert(alert)}
            /> 
                </>
            )}
            {activeTab === "history" &&(
                <>
                <h2>Resolved Alerts</h2>
                <Input
                placeholder="Instance Id or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                />

            <DataTable
                data={filterAlert}
                columns={alertColumns}
                getRowKey={(alert) => alert.id}
                onRowClick={(alert) => setSelectedAlert(alert)}
            /> 
                </>
            )}
            {/* Modal de detalle: uno solo, fuera de los tabs, controlado por selectedAlert */}
            <AlertDetailModal
                alert={selectedAlert}
                open={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
                // onViewResource={(alert) => navigate(`/${service}/${alert.resourceId}`)}
                // onViewRule={(alert) => navigate(`/rules/${alert.ruleId}`)}
            />
        </div>
    )
}