import { Request, Response } from "express";
import { 
  getEksClustersFromOrganization,
  getEksClusterByIdFromOrganization,
  getEksNodeByIdFromOrganization,
  getEksNodeGroupByIdFromOrganization
 } from "../services/awsServices/eks/eksAgregatorService";


export const getClusters = async (
  req: Request,
  res: Response
) => {
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const clusters = await getEksClustersFromOrganization(
      organizationId,
      region,
      accountId
  );

  res.json(clusters);
};

/* Filtro de cluster por ID */
export const getClusterById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const eksCluster = await getEksClusterByIdFromOrganization(
      organizationId,
      region,
      clusterId,
      accountId,

  );

  if (!eksCluster) {
    return res.status(404).json({
      message: "Cluster not found",
    });
  }

  res.json(eksCluster);
};

/* Filtro por cluster y node group */
export const getNodeGroupById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();
  const nodeGroupId = req.params.nodeGroupId.toString();
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const nodeGroup = await getEksNodeGroupByIdFromOrganization(
    organizationId,
    region,
    clusterId,
    nodeGroupId,
    accountId
  );

  if (!nodeGroup) {
    return res.status(404).json({
      message: "Node Group not found",
    });
  }

  res.json(nodeGroup);
};

/* Filtro por cluster, node group y nodo */
export const getNodeById = async (
  req: Request,
  res: Response
) => {
  const clusterId = req.params.clusterId.toString();
  const nodeGroupId = req.params.nodeGroupId.toString();
  const nodeId = req.params.nodeId.toString();
  const organizationId = req.query.organization as string;
  const region = req.query.region as string;
  const accountId = req.query.account as string | undefined;

  const node = await getEksNodeByIdFromOrganization(
    organizationId,
    region,
    clusterId,
    nodeGroupId, 
    nodeId,
    accountId,
  )

  if (!node) {
    return res.status(404).json({
      message: "Node Group not found",
    });
  }

  res.json(node);
};