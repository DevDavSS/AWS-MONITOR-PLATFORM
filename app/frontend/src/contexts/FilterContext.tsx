import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface AwsFilters {

    organizationId: string;

    accountId?: string;

    region: string;

}

interface FilterContextType {

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

    const [filters, setFilters] = useState<AwsFilters>({

        organizationId: "ION-Banco",

        accountId: "all",

        region: "us-west-2",

    });

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
            }}
        >
            {children}
        </FilterContext.Provider>
    );

}

export function useFilters() {
    return useContext(FilterContext)!;
}