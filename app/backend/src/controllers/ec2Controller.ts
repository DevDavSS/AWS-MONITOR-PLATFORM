import { Request, Response } from "express";

import { 
  getEc2InstancesFromOrganization,
  getEc2InstanceFromOrganizationById
} from "../services/integrations/awsServices/ec2/ec2AgregatorService";

export const getInstances = async (
  req: Request,
  res: Response
) => {

  const organizationId = req.query.organization as string;
  const region = req.query.region as string | undefined;
  const accountId = req.query.account as string | undefined;


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

  const id = req.params.id as string;

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;

  const accountId =
    typeof req.query.account === "string" &&
    req.query.account.trim() !== ""
      ? req.query.account
      : undefined;


  if (!id) {
    return res.status(400).json({
      message: "instance id is required"
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


  const instance =
    await getEc2InstanceFromOrganizationById(
      organizationId,
      region,
      id,
      accountId
    );


  res.json(instance);

};