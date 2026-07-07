import { Request, Response } from "express";
import { getEksClusters, getEksClusterById, getEksNodeGroupById,getEksNodeById} from "../services/eks/eksService";

export const getClusters = async (
  req: Request,
  res: Response
) => {
  const clusters = await getEksClusters();

  res.json(clusters);
};

export const getClusterById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();

  const eksCluster = await getEksClusterById(clusterId);

  if (!eksCluster) {
    return res.status(404).json({
      message: "Cluster not found",
    });
  }

  res.json(eksCluster);
};

export const getNodeGroupById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();
  const nodeGroupId = req.params.nodeGroupId.toString();

  const nodeGroup = await getEksNodeGroupById(
    clusterId,
    nodeGroupId
  );

  if (!nodeGroup) {
    return res.status(404).json({
      message: "Node Group not found",
    });
  }

  res.json(nodeGroup);
};


export const getNodeById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();
  const nodeGroupId = req.params.nodeGroupId.toString();
  const nodeId = req.params.nodeId.toString();

  const node = await getEksNodeById(clusterId,nodeGroupId, nodeId)

  if (!node) {
    return res.status(404).json({
      message: "Node Group not found",
    });
  }

  res.json(node);
};