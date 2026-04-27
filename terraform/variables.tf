variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "project_name" {
  type    = string
  default = "taskmanagement"
}

variable "db_name" {
  type    = string
  default = "taskmanagement"
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "key_pair_name" {
  type        = string
  description = "EC2 Key Pair 名（~/.ssh/<key_pair_name>.pub が存在すること）"
}

variable "my_ip_cidr" {
  type        = string
  description = "SSH を許可する自分の IP（例: 203.0.113.1/32）"
}
