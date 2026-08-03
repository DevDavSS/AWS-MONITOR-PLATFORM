import { Request, Response } from "express";
import { 
  getAuroraRdsFromOrganization, 
  getAuroraRdsFromOrganizationById 
} from "../services/integrations/awsServices/rds/rdsAgregatorService";


const getAccountId = (req: Request): string | undefined => {
  return typeof req.query.account === "string" &&
    req.query.account.trim() !== ""
      ? req.query.account
      : undefined;
};



export const getAuroraRdsInstances = async (
  req: Request,
  res: Response
) => {

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


  if (!organizationId) {
    return res.status(400).json({
      message: "organization is required"
    });
  }


  if (!region) {
    return res.status(400).json({
      message: "region is required"
    });
  }


  const databases = 
    await getAuroraRdsFromOrganization(
      organizationId,
      region,
      accountId
    );


  res.json(databases);
};



export const getDatabaseById = async (
  req: Request,
  res: Response
) => {

  const id = req.params.id as string;

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


  if (!id) {
    return res.status(400).json({
      message: "database id is required"
    });
  }


  if (!organizationId) {
    return res.status(400).json({
      message: "organization is required"
    });
  }


  if (!region) {
    return res.status(400).json({
      message: "region is required"
    });
  }


  const database = 
    await getAuroraRdsFromOrganizationById(
      organizationId,
      region,
      id,
      accountId
    );


  if (!database) {
    return res.status(404).json({
      message: "Database not found"
    });
  }


  res.json(database);
};