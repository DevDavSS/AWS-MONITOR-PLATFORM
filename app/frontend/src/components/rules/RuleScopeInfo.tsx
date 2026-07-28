import type { RuleFilters } from "@/types/RuleFilters";


interface RuleScopeInfoProps {

    filters: RuleFilters;

}


export function RuleScopeInfo({

    filters

}: RuleScopeInfoProps) {


    return (

        <div className="
            rounded-lg
            bg-gray-50
            border
            border-gray-200
            p-4
        ">


            <p className="
                text-xs
                font-medium
                text-gray-400
                mb-3
            ">
                Alcance de la regla
            </p>


            <div className="
                grid
                grid-cols-2
                gap-4
            ">


                <div>

                    <p className="text-xs text-gray-400">
                        Organización
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                        {filters.organizationId}
                    </p>

                </div>



                <div>

                    <p className="text-xs text-gray-400">
                        Cuenta
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                        {filters.accountId ?? "Todas"}
                    </p>

                </div>



                <div>

                    <p className="text-xs text-gray-400">
                        Región
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                        {filters.region ?? "Todas"}
                    </p>

                </div>



                <div>

                    <p className="text-xs text-gray-400">
                        Servicio
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                        {filters.service ?? "Todos"}
                    </p>

                </div>


            </div>


        </div>

    );

}