resource "aws_eks_cluster" "eks" {
  name     = var.nombre_proyecto
  role_arn = data.aws_iam_role.labrole.arn

  vpc_config {
    subnet_ids              = aws_subnet.eks_public[*].id
    security_group_ids      = [aws_security_group.eks_additional.id]
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  tags = {
    Name = var.nombre_proyecto
  }
}

resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "${var.nombre_proyecto}-workers"
  node_role_arn   = data.aws_iam_role.labrole.arn
  subnet_ids      = aws_subnet.eks_public[*].id
  instance_types  = var.node_instance_types
  capacity_type   = "ON_DEMAND"

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [aws_eks_cluster.eks]
}

resource "aws_eks_addon" "ebs_csi" {
  cluster_name = aws_eks_cluster.eks.name
  addon_name   = "aws-ebs-csi-driver"

  depends_on = [aws_eks_node_group.workers]
}
