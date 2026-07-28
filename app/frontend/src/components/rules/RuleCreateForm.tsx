import type { Dispatch, SetStateAction } from "react";

import type { RuleFilters } from "@/types/RuleFilters";
import type { RuleSelectableResource } from "@/types/RuleSelectableResource";
import { RuleResourceSelector } from "./RuleResourceSelector";

import type {
    RuleFormData,
    AlertMetric,
    AlertOperator,
    AlertResourceType
} from "@/types/Alert";

import { metricOptions, resourceTypeOptions } from "@/config/alertOptions";

interface RuleCreateFormProps {

    filters: RuleFilters;

    resources: RuleSelectableResource[];

    resourceType: AlertResourceType;

    fixedResourceId?: string;

    value: RuleFormData;

    onChange: Dispatch<SetStateAction<RuleFormData>>;

}


export function RuleCreateForm({

    resources,

    filters,

    fixedResourceId,

    value,

    onChange

}: RuleCreateFormProps) {


    return (

        <div className="space-y-5">


            <RuleResourceSelector

                resources={resources}

                filters={filters}

                fixedResourceId={fixedResourceId}

                selectedIds={value.resourceIds}

                onChange={(resourceIds) =>

                    onChange({

                        ...value,

                        resourceIds

                    })

                }

            />


            <div className="grid grid-cols-2 gap-4">


                <div>

                    <label className="text-xs text-gray-500">
                        Tipo de recurso
                    </label>


                    <select

                        value={value.resourceType}

                        onChange={(e) =>

                            onChange({

                                ...value,

                                resourceType:
                                    e.target.value as AlertResourceType

                            })

                        }

                        className="
                            mt-1
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-sm
                        "

                    >

                        {
                            resourceTypeOptions[filters.service!]
                                .filter(type => type.value === value.resourceType)
                                .map(type => (
                                    <option
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </option>
                                ))
                        }

                    </select>

                </div>



                <div>

                    <label className="text-xs text-gray-500">
                        Métrica
                    </label>


                    <select

                        value={value.metric}

                        onChange={(e) =>

                            onChange({

                                ...value,

                                metric:
                                    e.target.value as AlertMetric

                            })

                        }

                        className="
                            mt-1
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-sm
                        "

>

                        {
                            metricOptions[filters.service!]
                                .map(metric => (

                                    <option

                                        key={metric.value}

                                        value={metric.value}

                                    >
                                        {metric.label}

                                    </option>

                                ))
                        }

                    </select>

                </div>


            </div>



            <div className="grid grid-cols-2 gap-4">


                <div>

                    <label className="text-xs text-gray-500">
                        Operador
                    </label>


                    <select

                        value={value.operator}

                        onChange={(e) =>

                            onChange({

                                ...value,

                                operator:
                                    e.target.value as AlertOperator

                            })

                        }

                        className="
                            mt-1
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-sm
                        "

                    >

                        <option value=">">
                            Mayor que (&gt;)
                        </option>

                        <option value="<">
                            Menor que (&lt;)
                        </option>

                        <option value="=">
                            Igual (=)
                        </option>

                        <option value=">=">
                            Mayor o igual (&gt;=)
                        </option>

                        <option value="<=">
                            Menor o igual (&lt;=)
                        </option>

                        <option value="!=">
                            Diferente (!=)
                        </option>


                    </select>

                </div>



                <div>

                    <label className="text-xs text-gray-500">
                        Threshold
                    </label>


                    <input

                        type="number"

                        value={value.threshold}

                        onChange={(e) =>

                            onChange({

                                ...value,

                                threshold:
                                    Number(e.target.value)

                            })

                        }

                        className="
                            mt-1
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-sm
                        "

                    />

                </div>


            </div>



            <div>

                <label className="flex items-center gap-3">


                    <input

                        type="checkbox"

                        checked={value.enabled}

                        onChange={(e) =>

                            onChange({

                                ...value,

                                enabled:
                                    e.target.checked

                            })

                        }

                    />


                    <span className="text-sm text-gray-700">

                        Regla habilitada

                    </span>


                </label>

            </div>


        </div>

    );

}