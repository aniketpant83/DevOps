provider "aws" {
    region = var.region
}

resource "aws_ecr_repository" "my_flask_ecr_image" {
  name = "my_flask_ecr_image"
}

resource "aws_ecr_repository" "my_react_ecr_image" {
  name = "my_react_ecr_image"
}