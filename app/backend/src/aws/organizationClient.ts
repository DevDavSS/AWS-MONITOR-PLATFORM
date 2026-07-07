import { OrganizationsClient } from "@aws-sdk/client-organizations";

export const OrgClient = new OrganizationsClient({
    region: "us-west-2"
})