import type { RuleFilters } from "@/types/RuleFilters";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import { ResourceSelectorTable } from "./ResourceSelectorTable";

interface RuleResourceSelectorProps {

    filters: RuleFilters;

    resources: RuleSelectableResource[];

    fixedResourceId?: string;

    selectedIds: string[];

    onChange: (ids: string[]) => void;

}
export function RuleResourceSelector({

    filters,

    resources,

    fixedResourceId,

    selectedIds,

    onChange

}: RuleResourceSelectorProps) {

    return (

        <div className="
            rounded-lg
            border
            border-dashed
            border-gray-300
            p-5
        ">

            <p className="
                text-sm
                font-medium
                text-gray-700
            ">
                Recursos asociados
            </p>

            <p className="
                mt-1
                mb-4
                text-xs
                text-gray-400
            ">
                Selecciona los recursos del servicio {filters.service}
            </p>

            <ResourceSelectorTable

                resources={resources}

                fixedResourceId={fixedResourceId}

                selectedIds={selectedIds}

                onChange={onChange}

            />

        </div>

    );

}