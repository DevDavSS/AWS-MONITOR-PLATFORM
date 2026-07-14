import type {AwsFilters}  from "@/contexts/FilterContext";

export const getEc2Instances = async (
    filters: AwsFilters
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
    const response = await fetch(
        `http://localhost:3000/api/ec2?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching Ec2 instances: ${response.statusText}`
      );
    }
    return response.json();
};

export const getEc2InstanceById = async (
  id: string,
  filters: AwsFilters,
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `http://localhost:3000/api/ec2/${id}?${params.toString()}`
  );

  return response.json();
}