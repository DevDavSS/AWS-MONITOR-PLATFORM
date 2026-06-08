import { Request, Response } from "express";
import { getEc2Instances } from "../services/ec2Service";

export const getInstances = (
  req: Request,
  res: Response
) => {
  const instances = getEc2Instances();

  res.json(instances);
};