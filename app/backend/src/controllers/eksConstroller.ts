import { Request, Response } from "express";
import { 
  getEksClustersFromOrganization,
  getEksClusterByIdFromOrganization,
  getEksNodeByIdFromOrganization,
  getEksNodeGroupByIdFromOrganization
} from "../services/integrations/awsServices/eks/eksAgregatorService";


const getAccountId = (req: Request): string | undefined => {
  return typeof req.query.account === "string" &&
    req.query.account.trim() !== ""
      ? req.query.account
      : undefined;
};


/* Todos los clusters */
export const getClusters = async (
  req: Request,
  res: Response
) => {

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


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

  const clusterId = req.params.clusterId as string;
  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


  if (!clusterId) {
    return res.status(400).json({
      message: "clusterId is required"
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


  const eksCluster = await getEksClusterByIdFromOrganization(
    organizationId,
    region,
    clusterId,
    accountId
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

  const clusterId = req.params.clusterId as string;
  const nodeGroupId = req.params.nodeGroupId as string;

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


  if (!clusterId || !nodeGroupId) {
    return res.status(400).json({
      message: "clusterId and nodeGroupId are required"
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

  const clusterId = req.params.clusterId as string;
  const nodeGroupId = req.params.nodeGroupId as string;
  const nodeId = req.params.nodeId as string;

  const organizationId = req.query.organization as string | undefined;
  const region = req.query.region as string | undefined;
  const accountId = getAccountId(req);


  if (!clusterId || !nodeGroupId || !nodeId) {
    return res.status(400).json({
      message: "clusterId, nodeGroupId and nodeId are required"
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


  const node = await getEksNodeByIdFromOrganization(
    organizationId,
    region,
    clusterId,
    nodeGroupId,
    nodeId,
    accountId
  );


  if (!node) {
    return res.status(404).json({
      message: "Node not found",
    });
  }


  res.json(node);
};