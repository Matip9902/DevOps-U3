locals {
  ecr_repositories = toset([
    "frontend",
    "backend-ventas",
    "backend-despacho"
  ])
}

resource "aws_ecr_repository" "app" {
  for_each = local.ecr_repositories

  name         = "${var.nombre_proyecto}-${each.key}"
  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }

  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "${var.nombre_proyecto}-${each.key}"
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  for_each   = aws_ecr_repository.app
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Conservar las ultimas 10 imagenes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}
