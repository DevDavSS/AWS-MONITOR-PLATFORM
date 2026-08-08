resource "aws_iam_role" "ec2" {

  name = "monitoring-ec2-role"

  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Effect = "Allow"

        Principal = {

          Service = "ec2.amazonaws.com"

        }

        Action = "sts:AssumeRole"

      }

    ]

  })

}

resource "aws_iam_policy" "monitoring" {

  name = "monitoring-policy"

  policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Effect = "Allow"

        Action = [

          "sts:AssumeRole"

        ]

        Resource = "*"

      }

    ]

  })

}


resource "aws_iam_role_policy_attachment" "monitoring" {
    
    role = aws_iam_role.ec2.name

    policy_arn = aws_iam_policy.monitoring.arn
}

resource "aws_iam_instance_profile" "ec2"{
    name = "monitoring-instance-profile"

    role = aws_iam_role.ec2.name
}

#Ubuntu Ami data

data "aws_ami" "ubuntu" {

  most_recent = true

  owners = ["099720109477"]

  filter {

    name = "name"

    values = [
      "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"
    ]

  }

  filter {

    name = "virtualization-type"

    values = ["hvm"]

  }

}

resource "aws_instance" "monitoring" {

    ami = data.aws_ami.ubuntu.id
    instance_type = var.instance_type

    subnet_id = var.subnet_a_id

    vpc_security_group_ids = [
        var.ec2_security_group_id
    ]

    iam_instance_profile = aws_iam_instance_profile.ec2.name

    key_name = var.key_name

    associate_public_ip_address = true

    user_data = file("${path.module}/scripts/user-data.sh")

    tags = {
        Name = "monitoring-server"
    }


}