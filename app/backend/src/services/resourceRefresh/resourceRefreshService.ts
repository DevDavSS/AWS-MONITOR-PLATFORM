import { organizations } from "../../config/organizations"
import { regions } from "../../config/regions"

import { refreshEc2OrganizationCache } from "../awsServices/ec2/ec2AgregatorService"
import { getAuroraRdsFromOrganization } from "../awsServices/rds/rdsAgregatorService"
import { getEksClustersFromOrganization } from "../awsServices/eks/eksAgregatorService"



export const refreshEc2Resources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await refreshEc2OrganizationCache(
                organization.id,
                region,
            );

        }

    }

};

export const refreshRdsResources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await getAuroraRdsFromOrganization(
                organization.id,
                region,
                "all"
            );

        }

    }

};

export const refreshEksResources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await getEksClustersFromOrganization(
                organization.id,
                region,
                "all"
            );

        }

    }

};

export const refreshResources = async () => {

    await refreshEc2Resources();

    await refreshRdsResources();

    await refreshEksResources();

};