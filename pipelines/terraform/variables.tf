variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "Deployment environment (dev | staging | prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Short name used as a prefix for all resources"
  type        = string
  default     = "pharmacy"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of AZs to use"
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "java_image" {
  description = "Container image URI for the Java pharmacy backend"
  type        = string
  default     = "ghcr.io/OWNER/REPO/simple-pharmacy:latest"
}

variable "ui_image" {
  description = "Container image URI for the React UI"
  type        = string
  default     = "ghcr.io/OWNER/REPO/pharmacy-dashboard-ui:latest"
}

variable "analytics_image" {
  description = "Container image URI for the Python analytics service"
  type        = string
  default     = "ghcr.io/OWNER/REPO/pharmacy-analytics:latest"
}
