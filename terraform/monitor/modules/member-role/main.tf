data "aws_iam_policy_document" "trust_policy" {
    statement {
      effect = "Allow"
    

    principals {
        type = "AWS"
        identifiers = [
            var.management_role_arn
        ]
    }
    actions = [
        "sts:AssumeRole"
    ]
    }
}

resource "aws_iam_role" "member_role" {
    name = var.role_name
    assume_role_policy = data.aws_iam_policy_document.trust_policy.json
}

data "aws_iam_policy_document" "monitor_permissions" {

  statement {

    effect = "Allow"

    actions = [

      # EC2
      "ec2:DescribeInstances",
      "ec2:DescribeVolumes",
      "ec2:DescribeTags",
      "ec2:DescribeRegions",

      # EKS
      "eks:ListClusters",
      "eks:DescribeCluster",
      "eks:ListNodegroups",
      "eks:DescribeNodegroup",

      # RDS
      "rds:DescribeDBInstances",
      "rds:DescribeDBClusters",

      # AutoScaling
      "autoscaling:DescribeAutoScalingGroups",

      # CloudWatch
      "cloudwatch:GetMetricData",
      "cloudwatch:ListMetrics",

      # SSM
      "ssm:DescribeInstanceInformation",

      # STS
      "sts:GetCallerIdentity",

      #Organizations
      "organizations:DescribeAccount"

    ]

    resources = ["*"]

  }

}

resource "aws_iam_policy" "member_policy" {

  name = "MonitoringAccountPolicy"

  policy = data.aws_iam_policy_document.monitor_permissions.json

}

resource "aws_iam_role_policy_attachment" "attach" {

  role =aws_iam_role.member_role.name

  policy_arn =aws_iam_policy.member_policy.arn

}