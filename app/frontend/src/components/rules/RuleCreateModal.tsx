
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { RuleFilters } from "@/types/RuleFilters";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import type { RuleFormData } from "@/types/Alert";
import { RuleScopeInfo } from "./RuleScopeInfo";
import { RuleCreateForm } from "./RuleCreateForm";
import { ActionButton } from "./ActionButtom";
import { createRule,updateRule } from "@/services/ruleService";
import type { AlertResourceType } from "@/types/Alert";
import type { AlertRule } from "@/types/AlertRule";

interface RuleCreateModalProps {

    open: boolean;

    onClose: () => void;

    resources: RuleSelectableResource[];

    filters: RuleFilters;

    resourceType: AlertResourceType;

    fixedResourceId?: string;

    editingRule?: AlertRule | null;

    onUpdated?: () => void;

}
export function RuleCreateModal({

    open,

    onClose,

    resources,

    resourceType,

    filters,

    fixedResourceId,

    editingRule,

    onUpdated

}: RuleCreateModalProps) {

    const [form, setForm] = useState<RuleFormData>({

        resourceType,

        metric: "cpu",

        operator: ">",

        threshold: 80,

        enabled: true,

        resourceIds: fixedResourceId ? [fixedResourceId] : []

    });


    useEffect(() => {

        if (!open)
            return;

        if (editingRule) {

            setForm({

                resourceType: editingRule.resourceType,

                metric: editingRule.metric,

                operator: editingRule.operator,

                threshold: editingRule.threshold,

                enabled: editingRule.enabled,

                resourceIds: [...editingRule.resourceIds]

            });

            return;

        }

        setForm({

            resourceType,

            metric: "cpu",

            operator: ">",

            threshold: 80,

            enabled: true,

            resourceIds: fixedResourceId ? [fixedResourceId] : []

        });

    }, [

        open,

        editingRule,

        fixedResourceId,

        resourceType

    ]);


    if (!open)
        return null;

    const handleCreateRule = async () => {

        if (form.resourceIds.length === 0) {

            alert("Debes seleccionar al menos un recurso.");

            return;

        }

        if (
            !filters.organizationId ||
            !filters.region ||
            !filters.service
        ) {

            alert("Faltan filtros requeridos para crear la regla.");

            return;

        }

        const organizationId = filters.organizationId;
        const region = filters.region;
        const service = filters.service;


        const accountIds = Array.from(
            new Set(
                resources
                    .filter(resource =>
                        form.resourceIds.includes(resource.id)
                    )
                    .map(resource =>
                        resource.account
                    )
            )
        );


        if (accountIds.length === 0) {

            alert("No se encontraron cuentas asociadas a los recursos seleccionados.");

            return;

        }


        try {

            await createRule({

                organizationId,

                accountIds,

                region,

                service,

                resourceType: form.resourceType,

                resourceIds: form.resourceIds,

                metric: form.metric,

                operator: form.operator,

                threshold: form.threshold

            });
            alert("Regla creada correctamente.");
            onClose();

        } catch (error) {

            console.error(error);

        }

    };

    const handleUpdateRule = async () => {

        if (!editingRule)
            return;
        if (form.resourceIds.length === 0) {

            alert("Debes seleccionar al menos un recurso.");

            return;
        }
        try {

            await updateRule(
                editingRule.id,
                {
                    metric: form.metric,
                    operator: form.operator,
                    threshold: form.threshold,
                    enabled: form.enabled,
                    resourceIds: form.resourceIds
                }
            );

            onClose();

            alert("Regla actualizada correctamente.");

            onUpdated?.();
            
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/30
        ">

            <div className="
                w-full
                max-w-5xl
                max-h-[90vh]
                overflow-y-auto
                rounded-xl
                border
                border-gray-200
                bg-white
                p-8
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">

                <h2 className="text-base font-semibold text-gray-900">
                    {editingRule ? "Actualizar regla" : "Crear nueva regla"}
                </h2>

                    <button

                        onClick={onClose}

                        className="
                            text-gray-400
                            hover:text-gray-700
                        "

                    >

                        <X className="w-5 h-5"/>

                    </button>

                </div>

                <div className="space-y-6">

                    <RuleScopeInfo

                        filters={filters}

                    />

                <RuleCreateForm

                    filters={filters}

                    resources={resources}

                    resourceType={resourceType}

                    fixedResourceId={fixedResourceId}

                    value={form}

                    onChange={setForm}

/>

                    <div className="
                        flex
                        justify-end
                        gap-3
                        pt-6
                        border-t
                        border-gray-200
                    ">

                        <button

                            onClick={onClose}

                            className="
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-gray-300
                                text-sm
                            "

                        >
                            Cancelar
                        </button>

                        <ActionButton

                            onClick={
                                editingRule
                                    ? handleUpdateRule
                                    : handleCreateRule
                            }

                            disabled={form.resourceIds.length === 0}

                        >
                            {editingRule ? "Actualizar regla" : "Crear regla"}
                        </ActionButton>

                    </div>

                </div>

            </div>

        </div>

    );

}