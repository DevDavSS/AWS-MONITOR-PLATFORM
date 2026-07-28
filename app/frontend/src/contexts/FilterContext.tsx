import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface AwsFilters {

    organizationId: string;

    accountId?: string;

    region: string;

}

interface FilterContextType {
    setEffectiveAccount: (accountId?: string) => void;

    filters: AwsFilters;

    setOrganization: (organizationId: string) => void;

    setAccount: (accountId?: string) => void;

    setRegion: (region: string) => void;

}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({
    children,
}: {
    children: ReactNode;
}) {
    const setEffectiveAccount = (accountId?: string) =>

        setFilters(prev => ({

            ...prev,

            accountId

        }));
const [filters,setFilters] = useState<AwsFilters>(() => {

    const saved = localStorage.getItem("aws-filters");

    console.log("FILTERS INIT:", saved);

    if(saved){
        return JSON.parse(saved);
    }

    return {
        organizationId:"",
        accountId:"all",
        region:"us-east-1"
    };

});
useEffect(() => {

    console.log("FILTERS CHANGE:", filters);

    localStorage.setItem(
        "aws-filters",
        JSON.stringify(filters)
    );

}, [filters]);
    const setOrganization = (organizationId: string) =>

        setFilters(prev => ({
            ...prev,
            organizationId,
            accountId: undefined, // reinicia la cuenta al cambiar de organización
        }));

    const setAccount = (accountId?: string) =>

        setFilters(prev => ({
            ...prev,
            accountId,
        }));

    const setRegion = (region: string) =>

        setFilters(prev => ({
            ...prev,
            region,
        }));

    return (
        <FilterContext.Provider
            value={{
                filters,
                setOrganization,
                setAccount,
                setRegion,
                setEffectiveAccount
            }}
        >
            {children}
        </FilterContext.Provider>
    );

}

export function useFilters() {
    return useContext(FilterContext)!;
}