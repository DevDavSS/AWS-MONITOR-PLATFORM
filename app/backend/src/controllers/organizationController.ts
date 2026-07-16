import { Request, Response } from "express";
import {organizationsNoArn} from "../config/organizations"
import { getAccounts } from "../services/awsServices/organizations/organizationService";

export const getOrganizations = async(
    req: Request,
    res: Response
) => {
    res.json(organizationsNoArn);
}


export const getOrgAccounts = async (
    req: Request,
    res: Response
) => {

    const organizationId = Array.isArray(req.params.organizationId) 
        ? req.params.organizationId[0] 
        : req.params.organizationId;
    
    const accounts =
        await getAccounts(
            
            organizationId
        );

    res.json(accounts);

};