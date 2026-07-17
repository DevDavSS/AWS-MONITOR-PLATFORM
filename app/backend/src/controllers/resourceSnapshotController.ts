import { Request, Response } from "express";

import { buildResourceSnapshots } from "../services/alertServices/resurceSnapshotService";

export const getResourceSnapshots = async (
    _: Request,
    res: Response
) => {

    const snapshots = await buildResourceSnapshots();

    res.json(snapshots);

};