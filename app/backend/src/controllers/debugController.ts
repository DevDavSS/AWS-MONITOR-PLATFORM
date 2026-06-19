// controllers/debugController.ts

import { Request, Response } from "express";
import { getCWAgentMetrics } from "../services/debugService";

export const debugCloudWatch = async (
  req: Request,
  res: Response
) => {

  const data = await getCWAgentMetrics();

  res.json(data);

};