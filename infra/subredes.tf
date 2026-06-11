resource "aws_subnet" "eks_public" {
  count = 2

  vpc_id                  = aws_vpc.eks_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.eks_vpc.cidr_block, 8, count.index + 10)
  availability_zone       = "${var.aws_region}${count.index == 0 ? "a" : "b"}"
  map_public_ip_on_launch = true

  tags = {
    Name                                           = "${var.nombre_proyecto}-public-${count.index + 1}"
    "kubernetes.io/role/elb"                       = "1"
    "kubernetes.io/cluster/${var.nombre_proyecto}" = "shared"
  }
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.eks_public)

  subnet_id      = aws_subnet.eks_public[count.index].id
  route_table_id = aws_route_table.public.id
}
