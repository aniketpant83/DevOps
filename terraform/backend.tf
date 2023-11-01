# The terraform state file is stored in the bucket below. This allows us to have version controlled configurations.

terraform {
  backend "s3" {
    bucket = "my-s3-dop-terraform-config"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}