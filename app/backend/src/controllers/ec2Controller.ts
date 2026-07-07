import { Request, Response } from "express";
import { getEc2InstancesAws, getEc2InstanceById } from "../services/ec2/ec2Service";

export const getInstances = async (
  req: Request,
  res: Response
) => {
  const instances = await getEc2InstancesAws();

  res.json(instances);
};

export const getInstanceById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id.toString();

  const instance = await getEc2InstanceById(id);

  res.json(instance);
};