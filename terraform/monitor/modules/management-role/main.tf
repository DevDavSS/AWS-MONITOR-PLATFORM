data "aws_iam_policy_document" "trust_policy" {
    statement {
      effect = "Allow"

      principals {
        type = "AWS"
        identifiers = [
            var.dashboard_role_arn
        ]
      }
    actions = [
        "sts:AssumeRole"
    ]
    }
}

#Creacion del rol para la aplicacion en cuenta master
resource "aws_iam_role" "management_role"{
    name = var.role_name
    assume_role_policy = data.aws_iam_policy_document.trust_policy.json
}

data "aws_iam_policy_document" "management_permissions" {

    statement {
        effect = "Allow"

        actions = [
        "organizations:DescribeOrganization",
        "organizations:ListAccounts",
        "sts:AssumeRole"
        ]
        resources = ["*"]
    }
}

# Creacion de policy para uso de sts, organizations del cuenta master

resource "aws_iam_policy" "management_policy" {
    name = "MonitoringManagementPoloicy"

    policy = data.aws_iam_policy_document.management_permissions.json
}

# Asocianr con el role management_role
resource "aws_iam_role_policy_attachment" "attach" {
    role = aws_iam_role.management_role.name
    policy_arn = aws_iam_policy.management_policy.arn
}