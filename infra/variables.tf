variable "aws_region" {
  description = "Region AWS donde se desplegara la infraestructura."
  type        = string
  default     = "us-east-1"
}

variable "nombre_proyecto" {
  description = "Prefijo comun para los recursos."
  type        = string
  default     = "innovatech-spa"
}

variable "lab_role_name" {
  description = "Rol IAM provisto por AWS Academy Learner Lab."
  type        = string
  default     = "LabRole"
}

variable "node_instance_types" {
  description = "Tipos de instancia para los nodos administrados de EKS."
  type        = list(string)
  default     = ["t3.medium"]
}
