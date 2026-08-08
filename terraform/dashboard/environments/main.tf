module "network" {
  source = "../modules/networking"
  aws_region = "us-east-2"
}

module "security_groups"{
    source = "../modules/security-groups"
    vpc_main_id = module.network.vpc_id
}

module "ec2"{
    source = "../modules/ec2"
    
    key_name = "monitor-keys"
    subnet_a_id = module.network.subnet_a_id
    ec2_security_group_id = module.security_groups.ec2_security_group_id
}

module "alb"{
    source = "../modules/alb"
    vpc_id = module.network.vpc_id
    monitoring_instance_id = module.ec2.monitoring_instance_id
    security_group_alb_id = module.security_groups.alb_security_group_id
    subnet_a_id = module.network.subnet_a_id
    subnet_b_id = module.network.subnet_b_id
}