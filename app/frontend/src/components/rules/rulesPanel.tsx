import { useEffect, useState } from "react";
import type { AlertRule } from "@/types/AlertRule";
import { useFilters } from "@/contexts/FilterContext";
import { getRules } from "@/services/ruleService";
import { RulesGrid } from "@/components/rules/RulesGrid";
import { ActionButton } from "./ActionButtom";
import { RuleCreateModal } from "./RuleCreateModal";
import { Plus } from "lucide-react";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import type { AlertService, AlertResourceType } from "@/types/Alert";
import { Input } from "@/components/ui/input";

interface RulePanelProps {
    service: AlertService;
    resourceType: AlertResourceType;
    resources: RuleSelectableResource[];
    resourceId?: string;
}

export default function RulePanel({
    service,
    resourceType,
    resources,
    resourceId
}: RulePanelProps) {

    const [rules, setRules] = useState<AlertRule[]>([]);
    const [loading, setLoading] = useState(true);
    const { filters } = useFilters();

    const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [search, setSearch] = useState("");
    const [metricFilter, setMetricFilter] = useState("all");
    const [enabledFilter, setEnabledFilter] =
        useState<"all" | "enabled" | "disabled">("all");


    const loadRules = async () => {

        setLoading(true);

        try {

            const data: AlertRule[] = await getRules({

                service,
                resourceId,
                organizationId: filters.organizationId,
                accountId: filters.accountId,
                region: filters.region

            });

            setRules(
                data.filter(rule =>
                    rule.resourceType === resourceType
                )
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadRules();

    }, [service, resourceId, filters]);


    const filteredRules = rules.filter(rule => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            rule.id.toLowerCase().includes(searchText) ||
            rule.resourceIds.some(id =>
                id.toLowerCase().includes(searchText)
            ) ||
            rule.metric.toLowerCase().includes(searchText);


        const matchesMetric =
            metricFilter === "all" ||
            rule.metric === metricFilter;


        const matchesEnabled =
            enabledFilter === "all" ||
            (enabledFilter === "enabled" && rule.enabled) ||
            (enabledFilter === "disabled" && !rule.enabled);


        return (
            matchesSearch &&
            matchesMetric &&
            matchesEnabled
        );

    });

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <h2 className="text-base font-semibold text-gray-900">
                    Reglas activas para:
                    Organizacion:{filters.organizationId} /
                    cuenta:{filters.accountId} /
                    region:{filters.region}
                </h2>

                <ActionButton
                    onClick={() => setOpenCreateModal(true)}
                    icon={<Plus className="w-4 h-4" />}
                >
                    Nueva regla
                </ActionButton>

            </div>


            <div className="flex gap-3 items-center">

                <Input
                    placeholder="Buscar regla, recurso o métrica..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />

                <select
                    value={metricFilter}
                    onChange={(e) => setMetricFilter(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                    <option value="all">
                        Todas las métricas
                    </option>

                    {
                        [...new Set(rules.map(rule => rule.metric))]
                        .map(metric => (
                            <option
                                key={metric}
                                value={metric}
                            >
                                {metric}
                            </option>
                        ))
                    }

                </select>


                <select
                    value={enabledFilter}
                    onChange={(e) =>
                        setEnabledFilter(
                            e.target.value as "all" | "enabled" | "disabled"
                        )
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >

                    <option value="all">
                        Todas
                    </option>

                    <option value="enabled">
                        Habilitadas
                    </option>

                    <option value="disabled">
                        Deshabilitadas
                    </option>

                </select>

            </div>


            <p className="text-sm text-gray-500">
                Mostrando {filteredRules.length} de {rules.length} reglas
            </p>

            <RulesGrid
                rules={filteredRules}
                loading={loading}
                onUpdate={(rule) => {

                    setSelectedRule(rule);

                    setOpenCreateModal(true);

                }}
            />

            <RuleCreateModal

                open={openCreateModal}

                onClose={() => {

                    setOpenCreateModal(false);
                    setSelectedRule(null);

                }}

                onUpdated={loadRules}

                filters={{ ...filters, service }}

                resources={resources}

                fixedResourceId={resourceId}

                resourceType={resourceType}

                editingRule={selectedRule}

            />

        </div>
    );
}