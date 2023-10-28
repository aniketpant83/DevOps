output "my-flask-ecr-image-url" {
  description = "URL of the flask image repository"
  value       = aws_ecr_repository.my_flask_ecr_image.repository_url
}

output "my-react-ecr-image-url" {
  description = "URL of the react image repository"
  value       = aws_ecr_repository.my_react_ecr_image.repository_url
}

output "region" {
  description = "AWS region where resources are created."
  value       = var.region
}
