import { 
    createCloudWatchClient, 
    createRdsClient
} from "../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts, getAccountsById } from "../organizations/organizationService";

import { 
    getAuroraRDSAws, 
    getAuroraRDSById 
} from "./rdsService";

import { RdsContext } from "../../types/awsConstext";


export const getAuroraRdsFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    let accounts;

    if (accountId && accountId !== "all") {
        const account = await getAccountsById(
            organizationId,
            accountId
        );

        if (!account) {
            return [];
        }

        accounts = [account];
    } else {
        accounts = await getAccounts(organizationId);
    }
    const auroraRdsInstances = await Promise.all(

        accounts.map(async account => {
            const credentials = 
                await getAccountCredentials(
                    organizationId,
                    account.id
                );

            const RdsContext: RdsContext = {

                organizationId,

                accountId: account.id,

                accountName: account.name,

                region,

                rdsClient: createRdsClient(credentials, region),

                cloudWatchClient: createCloudWatchClient(credentials, region)

            };
            return await getAuroraRDSAws(
                RdsContext
            );
        })
    )
    return auroraRdsInstances.flat();
};

export const getAuroraRdsFromOrganizationById = async (
    organizationId: string,
    region: string,
    auroraRdsInstanceId: string,
    accountId?: string
) => {
    let accounts;

    if (accountId && accountId !== "all") {
        const account = await getAccountsById(
            organizationId,
            accountId
        );

        if (!account) {
            return [];
        }

        accounts = [account];
    } else {
        accounts = await getAccounts(organizationId);
    }
    
    for (const account of accounts){
        const credentials =
            await getAccountCredentials(organizationId, account.id)
        const rdsConstext: RdsContext = {

            organizationId,

            accountId: account.id,

            accountName: account.name,

            region,
            
            rdsClient:
                createRdsClient(
                    credentials,
                    region
                ),

            cloudWatchClient: 
                createCloudWatchClient(
                    credentials,
                    region
                ),
            
        };

        const auroraRdsInstance = 
            await getAuroraRDSById(
                auroraRdsInstanceId,
                rdsConstext
            )
        if (auroraRdsInstance) {
            return auroraRdsInstance
        }
    }

    return undefined;
};