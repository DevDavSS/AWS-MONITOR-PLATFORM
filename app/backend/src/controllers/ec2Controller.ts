import { Request, Response } from "express";

import { 
  getEc2InstancesFromOrganization,
  getEc2InstanceFromOrganizationById
} from "../services/awsServices/ec2/ec2AgregatorService";

export const getInstances = async (
  req: Request,
  res: Response
) => {

  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const instances = await getEc2InstancesFromOrganization(
      organizationId,
      region,
      accountId
  );

  res.json(instances);

};

export const getInstanceById = async (
  req: Request,
  res: Response
) => {

  const id = req.params.id.toString();
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const instance =
    await getEc2InstanceFromOrganizationById(
      organizationId,
      region,
      id,
      accountId
    )

  res.json(instance);

};