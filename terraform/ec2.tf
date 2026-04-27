data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "main" {
  key_name   = var.key_pair_name
  public_key = file("~/.ssh/${var.key_pair_name}.pub")
}

resource "aws_instance" "main" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = aws_key_pair.main.key_name

  user_data = <<-EOF
    #!/bin/bash
    set -e
    dnf update -y
    dnf install -y java-21-amazon-corretto-headless nginx
    systemctl enable nginx
    mkdir -p /opt/taskmanagement /var/www/taskmanagement /var/log/taskmanagement
    useradd -r -s /bin/false -d /opt/taskmanagement taskmanagement || true
    chown taskmanagement:taskmanagement /opt/taskmanagement
  EOF

  tags = { Name = "${var.project_name}-ec2" }
}

