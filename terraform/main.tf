# Choosing AWS as provider
provider "aws" {
    region = var.region
}

# ECR repo to store flask image
resource "aws_ecr_repository" "tf_tm_flask_ecr_image" {
  name = "tf_tm_flask_ecr_image"
}

# ECR repo to store react image
resource "aws_ecr_repository" "tf_tm_react_ecr_image" {
  name = "tf_tm_react_ecr_image"
}

# Network components to host the cluster are fetched from the stack. The exact components are available in a file in this directory for your referrence.
resource "aws_cloudformation_stack" "eks_vpc_stack" {
  name         = "tf-tm-eks-vpc-stack"
  template_url = "https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml"
}

# Cluster runs with this role and has an inline policy to allow actions for eks
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

# Attach a policy to the cluster role
resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# Create the EKS cluster referrencing resources made prior to this step
resource "aws_eks_cluster" "my_cluster" {
  name     = "tf_tm_my_eks_cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [aws_cloudformation_stack.eks_vpc_stack.outputs.SubnetIds]
    security_group_ids = [aws_cloudformation_stack.eks_vpc_stack.outputs.SecurityGroups]
  }
  depends_on = [aws_cloudformation_stack.eks_vpc_stack, aws_iam_role.eks_cluster_role, aws_iam_role_policy_attachment.eks_cluster_policy_attachment]
}

# Create IAM node role with an inline policy
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

# Attach policy 1 to node role
resource "aws_iam_role_policy_attachment" "eks_node_policy_1_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

# Attach policy 2 to node role
resource "aws_iam_role_policy_attachment" "eks_node_policy_2_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

# Attach policy 3 to node role
resource "aws_iam_role_policy_attachment" "eks_node_policy_3_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role      = aws_iam_role.eks_node_role.name
  depends_on = [aws_eks_cluster.my_cluster]
}

# Create the node groups which would be within the cluster
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