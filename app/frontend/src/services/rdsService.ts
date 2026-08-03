import type { AwsFilters } from "@/contexts/FilterContext";
const API_URL = import.meta.env.VITE_BACKEND_API;


export  const getRdsDatabases = async(
    filters: AwsFilters
) => {

    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `${API_URL}/rds?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch RDS Databases");
  }

  return response.json();
}

export const getRdsDatabasesById = async(
  id: string,
  filters: AwsFilters
) => {

    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `${API_URL}/rds/${id}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch RDS Database");
  }

  return response.json();
}