variable "management_role_arn" {
    description = "ARN de MonitoringManagementRole"
    type        = string
}

variable "role_name" {
    description = "Nombre del rol"
    type        = string
    default     = "MonitoringAccountRole"
}