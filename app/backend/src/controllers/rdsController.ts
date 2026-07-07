import { Request, Response } from "express";
import { getAuroraRDSAws, getAuroraRDSById } from "../services/rds/rdsService";

export const getDatabases = async (
  req: Request,
  res: Response
) => {
  const databases = await getAuroraRDSAws();

  res.json(databases);
};

export const getDatabaseById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id.toString();

  const database = await getAuroraRDSById(id);

  res.json(database);
};