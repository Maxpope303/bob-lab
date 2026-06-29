# Prod environment overrides
environment          = "prod"
aws_region           = "eu-west-2"
vpc_cidr             = "10.1.0.0/16"
availability_zones   = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
private_subnet_cidrs = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
public_subnet_cidrs  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]
