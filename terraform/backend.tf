terraform {
  backend "s3" {
    bucket = "my-s3-dop-terraform-config"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}