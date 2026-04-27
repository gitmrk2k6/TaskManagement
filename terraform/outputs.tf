output "ec2_public_ip" {
  description = "EC2 のパブリック IP（CORS設定・ブラウザアクセスに使用）※インスタンス再起動で変わる"
  value       = aws_instance.main.public_ip
}

output "rds_address" {
  description = "RDS のホスト名（app.env の DB_HOST に設定）"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS のポート番号"
  value       = aws_db_instance.main.port
}

output "ssh_command" {
  description = "EC2 への SSH コマンド"
  value       = "ssh -i ~/.ssh/${var.key_pair_name} ec2-user@${aws_instance.main.public_ip}"
}
