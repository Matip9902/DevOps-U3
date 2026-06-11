terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# AWS Academy entrega este rol preconfigurado para el laboratorio.
data "aws_iam_role" "labrole" {
  name = var.lab_role_name
}
