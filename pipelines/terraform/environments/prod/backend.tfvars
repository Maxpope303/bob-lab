bucket         = "pharmacy-terraform-state-prod"
key            = "pharmacy/prod/terraform.tfstate"
region         = "eu-west-2"
dynamodb_table = "pharmacy-terraform-locks"
encrypt        = true
