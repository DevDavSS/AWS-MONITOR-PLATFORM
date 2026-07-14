import { Request, Response } from "express";
import { 
  getAuroraRdsFromOrganization, 
  getAuroraRdsFromOrganizationById 
} from "../services/rds/rdsAgregatorService";


export const getAuroraRdsInstances = async (
  req: Request,
  res: Response
) => {
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;
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
  const id = req.params.id.toString();
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const database = 
    await getAuroraRdsFromOrganizationById(
      organizationId,
      region,
      id,
      accountId
    );

  res.json(database);
};