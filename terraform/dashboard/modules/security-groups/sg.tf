resource "aws_security_group" "alb" {

  name = "monitoring-alb-sg"

  description = "Application Load Balancer"

  vpc_id = var.vpc_main_id

  ingress {

    from_port = 80
    to_port = 80

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port = 443
    to_port = 443

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {

    from_port = 0
    to_port = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

}

resource "aws_security_group" "ec2" {

  name = "monitoring-ec2-sg"

  description = "EC2 Security Group"

  vpc_id = var.vpc_main_id

  ingress {

    from_port = 80
    to_port = 80

    protocol = "tcp"

    security_groups = [
      aws_security_group.alb.id
    ]

  }

  ingress {

    from_port = 22
    to_port = 22

    protocol = "tcp"

    cidr_blocks = [
      "187.243.194.56/32"
    ]

  }

  egress {

    from_port = 0
    to_port = 0

    protocol = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]

  }

}