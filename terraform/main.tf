provider "aws" {
    region = var.region
}

resource "aws_ecr_repository" "tf_tm_flask_ecr_image" {
  name = "tf_tm_flask_ecr_image"
}

resource "aws_ecr_repository" "tf_tm_react_ecr_image" {
  name = "tf_tm_react_ecr_image"
}

resource "aws_cloudformation_stack" "eks_vpc_stack" {
  name         = "tf-tm-eks-vpc-stack"
  template_url = "https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml"
}

resource "aws_iam_role" "eks_cluster_role" {
  name = "tf_myAmazonEKSClusterRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_eks_cluster" "my_cluster" {
  name     = "tf_tm_my_eks_cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [aws_cloudformation_stack.eks_vpc_stack.outputs.SubnetIds]
    security_group_ids = [aws_cloudformation_stack.eks_vpc_stack.outputs.SecurityGroups]
  }
  depends_on = [aws_cloudformation_stack.eks_vpc_stack, aws_iam_role.eks_cluster_role, aws_iam_role_policy_attachment.eks_cluster_policy_attachment]
}

resource "aws_iam_role" "eks_node_role" {
  name = "tf_myAmazonEKSNodeRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_policy_1_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

resource "aws_iam_role_policy_attachment" "eks_node_policy_2_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

resource "aws_iam_role_policy_attachment" "eks_node_policy_3_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role      = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

resource "aws_eks_node_group" "my_node_group" {
  cluster_name    = aws_eks_cluster.my_cluster.name
  node_group_name = "tf_tm_node_group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [aws_cloudformation_stack.eks_vpc_stack.outputs.SubnetIds]
  instance_types = ["t3.micro"]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  depends_on = [aws_iam_role_policy_attachment.eks_node_policy_1_attachment, aws_iam_role_policy_attachment.eks_node_policy_2_attachment, aws_iam_role_policy_attachment.eks_node_policy_3_attachment]
}