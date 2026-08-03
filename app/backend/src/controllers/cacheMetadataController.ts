import { Request, Response } from "express";
import { getCacheMetadata } from "../cache/resourceCache";

export const cacheMetadata = async (
  req: Request,
  res: Response
) => {

    res.json(getCacheMetadata());


};
