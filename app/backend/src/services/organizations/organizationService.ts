import { 
    DescribeOrganizationCommand, 
    ListAccountsCommand
} from "@aws-sdk/client-organizations";

import { OrgClient } from "../../aws/organizationClient";

export const getOrganizations = async () => {

    const organization = 
        await OrgClient.send(
            new DescribeOrganizationCommand({})
        );
    
    const accounts = 
        await OrgClient.send(
            new ListAccountsCommand({})
        );

        {/* Estructurizacion de datos basado en el type en /types/organization.ts */}
    return {
        id:
            organization.Organization?.Id ?? "",
        arn:
            organization.Organization?.Arn ?? "",

        managementAccountId:
            organization.Organization?.MasterAccountId ??
        "",
        featureSet:
            organization.Organization?.FeatureSet ?? "",

        accounts:
        (accounts.Accounts ?? []).map(account => ({

            id:
            account.Id ?? "",

            name:
            account.Name ?? "",

            email:
            account.Email ?? "",

            status:
            account.Status ?? "",

        })),
    }
};
