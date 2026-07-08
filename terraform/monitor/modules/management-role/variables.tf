variable "dashboard_role_arn" {
  description = "IAM Role ARN del Dashboard Backend"
  type        = string
}

variable "role_name" {
  description = "Nombre del rol de monitoreo"
  type        = string
  default     = "MonitoringManagementRole"
}