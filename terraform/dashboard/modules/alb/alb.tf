resource "aws_lb_target_group" "monitoring" {

    name = "monitoring-tg"

    port = 80

    protocol = "HTTP"

    target_type = "instance"

    vpc_id = var.vpc_id

    health_check {
        
        enabled = true

        path = "/"

        protocol = "HTTP"

        matcher = "200"

        interval = 30

        timeout = 5

        healthy_threshold = 2

        unhealthy_threshold = 2

    }

}

resource "aws_lb_target_group_attachment" "monitoring"{

    target_group_arn = aws_lb_target_group.monitoring.arn

    target_id = var.monitoring_instance_id

    port = 80
}

resource "aws_lb" "monitoring"{

    name =  "monitoring-alb"

    load_balancer_type = "application"

    internal = false

    security_groups = [
        var.security_group_alb_id
    ]
    
    subnets = [
        var.subnet_a_id,
        var.subnet_b_id
    ]

    enable_deletion_protection = false

    tags = {
        Name = "monitoring-alb"
    }

}

resource "aws_lb_listener" "http" {
    load_balancer_arn = aws_lb.monitoring.arn

    port = 80

    protocol = "HTTP"

    default_action {
      type = "forward"

      target_group_arn = aws_lb_target_group.monitoring.arn
    }
}