# module "management-role" {
#     source = "./modules/management-role"
#     dashboard_role_arn = "arn:aws:sts::682033489340:assumed-role/AWSReservedSSO_AdministratorAccess_6727ab44b30e3f2c/franco.sanchez"
#     role_name = "MonitoringManagementRole"
# }

module "member_role" {
  source = "./modules/member-role"
  management_role_arn = var.management_role_arn
  role_name = "MonitoringAccountRole"
}