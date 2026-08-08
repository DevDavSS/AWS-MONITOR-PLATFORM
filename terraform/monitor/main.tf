module "management-role" {
    source = "./modules/management-role"
    dashboard_role_arn = var.dashboard_role_arn
    role_name = "MonitoringManagementRole"
}

# module "member_role" {
#   source = "./modules/member-role"
#   management_role_arn = var.management_role_arn
#   role_name = "MonitoringAccountRole"
# }