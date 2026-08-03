import { organizations } from "../../config/organizations"
import { regions } from "../../config/regions"

import { refreshEc2OrganizationCache } from "../integrations/awsServices/ec2/ec2AgregatorService"
import { refreshRdsOrganizationCache } from "../integrations/awsServices/rds/rdsAgregatorService"
import { refreshEksOrganizationCache } from "../integrations/awsServices/eks/eksAgregatorService"



export const refreshEc2Resources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await refreshEc2OrganizationCache(
                organization.id!,
                region,
            );

        }

    }

};

export const refreshRdsResources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await refreshRdsOrganizationCache(
                organization.id!,
                region,
            );

        }

    }

};

export const refreshEksResources = async () => {

    for (const organization of organizations) {

        for (const region of regions) {

            await refreshEksOrganizationCache(
                organization.id!,
                region,
            );

        }

    }

};

export const refreshResources = async () => {

    await refreshEc2Resources();

    await refreshRdsResources();

    await refreshEksResources();

};