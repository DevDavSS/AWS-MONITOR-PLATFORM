variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "SSH Key Pair"
  type        = string
}

variable "subnet_a_id" {
  type = string
}

variable "ec2_security_group_id" {
  type = string
}