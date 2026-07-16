import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type HeaderContextType = {
  extraFilters: ReactNode;
  setExtraFilters: (filters: ReactNode) => void;

  filtersEnabled: boolean;
  setFiltersEnabled: (enabled: boolean) => void;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export function HeaderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [extraFilters, setExtraFilters] = useState<ReactNode>(null);

  const [filtersEnabled, setFiltersEnabled] =
    useState(true);

  return (
    <HeaderContext.Provider
      value={{
        extraFilters,
        setExtraFilters,

        filtersEnabled,
        setFiltersEnabled,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext)!;
}