import {
    STSClient,
    AssumeRoleCommand
} from "@aws-sdk/client-sts";

import { AwsCredentials } from "../../../types/services/aws";
import {organizations} from "../../../config/organizations"



const stsClient = new STSClient({});

export const assumeManagementRole = async (
    organizationId: string
): Promise<AwsCredentials> => {
    
    const organization = organizations.find(
        org => org.id === organizationId
    );

    if (!organization) {
        throw new Error("Organization not found.");
    }

    const response = await stsClient.send(
        new AssumeRoleCommand({
            RoleArn: organization.managementRoleArn,
            RoleSessionName: `Management-${organizationId}`,
        })
    );

    if (!response.Credentials) {
        throw new Error("Unable to assume management role.");
    }

    return {
        accessKeyId: response.Credentials.AccessKeyId!,
        secretAccessKey: response.Credentials.SecretAccessKey!,
        sessionToken: response.Credentials.SessionToken!,
        expiration: response.Credentials.Expiration!,
    };
};

export const assumeMemberRole = async (
    accountId : string,
    managementCredentials: AwsCredentials
):Promise<AwsCredentials> => {

    const roleArn = 
        `arn:aws:iam::${accountId}:role/MonitoringAccountRole`;

    const stsClient = new STSClient({
        credentials: {
            accessKeyId: managementCredentials.accessKeyId,
            secretAccessKey: managementCredentials.secretAccessKey,
            sessionToken: managementCredentials.sessionToken
        }
    })

    const response = await stsClient.send(
        new AssumeRoleCommand({
            RoleArn: roleArn,
            RoleSessionName: `Member-${accountId}`,

        })
    );
    if (!response.Credentials){
        throw new Error("Unable to Assume Member Role")
    }

    return {
        accessKeyId: response.Credentials.AccessKeyId!,
        secretAccessKey: response.Credentials.SecretAccessKey!,
        sessionToken: response.Credentials.SessionToken!,
        expiration: response.Credentials.Expiration!,
    }
}