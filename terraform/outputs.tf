# All outputs are self explanatory

output "tf_tm_flask_ecr_image_url" {
  description = "URL of the flask image repository"
  value       = aws_ecr_repository.tf_tm_flask_ecr_image.repository_url
}

output "tf_tm_react_ecr_image_url" {
  description = "URL of the react image repository"
  value       = aws_ecr_repository.tf_tm_react_ecr_image.repository_url
}

output "region" {
  description = "AWS region where resources are created."
  value       = var.region
}

output "eks_cluster_name" {
  value = aws_eks_cluster.my_cluster.name
}

output "eks_cluster_vpc_id" {
  value = aws_cloudformation_stack.eks_vpc_stack.outputs.VpcId
}
