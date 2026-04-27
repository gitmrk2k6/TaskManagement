# インフラ構成

## アーキテクチャ概要

```
[ブラウザ]
    |
    | HTTP :80
    v
[EC2 (Amazon Linux 2023 / t2.micro)]
    |-- Nginx
    |     |-- /* --> /var/www/taskmanagement  (React 静的ファイル)
    |     `-- /api/* --> localhost:8080       (Spring Boot へリバースプロキシ)
    |
    `-- Spring Boot :8080
          |
          | PostgreSQL :5432
          v
      [RDS (PostgreSQL 17 / db.t3.micro)]
      ※ プライベートサブネット配置（外部から直接アクセス不可）
```

## AWS サービス構成

| サービス | スペック | 用途 |
|---------|---------|------|
| EC2 | t2.micro / Amazon Linux 2023 | アプリサーバー（Spring Boot + Nginx） |
| RDS | db.t3.micro / PostgreSQL 17 | データベース |
| VPC | パブリック + プライベートサブネット | ネットワーク分離 |
| Security Group | EC2用・RDS用の2つ | アクセス制御 |

## ネットワーク構成

```
VPC (10.0.0.0/16)
 |
 |-- パブリックサブネット (10.0.1.0/24) ── EC2
 |     `-- Internet Gateway 経由でインターネット接続
 |
 |-- プライベートサブネット 1 (10.0.2.0/24) ──┐
 `-- プライベートサブネット 2 (10.0.3.0/24) ──┴── RDS (外部アクセス不可)
```

**セキュリティグループのルール:**

- EC2: インバウンド TCP 80（HTTP）を全開放 / TCP 22（SSH）を特定IPのみ許可
- RDS: インバウンド TCP 5432（PostgreSQL）を EC2 のセキュリティグループからのみ許可

## ディレクトリ構成

```
TaskManagement/
├── terraform/          # インフラ定義（IaC）
│   ├── provider.tf     # AWS プロバイダー設定
│   ├── variables.tf    # 変数定義
│   ├── vpc.tf          # VPC・サブネット・IGW
│   ├── security_groups.tf  # セキュリティグループ
│   ├── ec2.tf          # EC2 インスタンス・キーペア
│   ├── rds.tf          # RDS PostgreSQL
│   └── outputs.tf      # 出力値（EC2 IP・RDS エンドポイント）
│
└── scripts/            # デプロイ用設定ファイル
    ├── nginx.conf      # Nginx 設定（リバースプロキシ + SPA 配信）
    └── taskmanagement.service  # systemd サービス定義
```

## デプロイ手順（概要）

### 前提条件

- AWS CLI 設定済み（`aws configure`）
- Terraform インストール済み（v1.0 以上）
- SSH キーペア生成済み

### 手順

1. **インフラ構築**（Terraform）
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```
   完了後、EC2 のパブリック IP と RDS のエンドポイントが出力される。

2. **アプリのビルド**（ローカル）
   ```bash
   cd backend && ./gradlew bootJar
   cd ../frontend && npm run build
   ```

3. **EC2 へ転送**（SCP）
   - JAR ファイル → `/opt/taskmanagement/`
   - React 静的ファイル → `/var/www/taskmanagement/`
   - `nginx.conf` → `/etc/nginx/conf.d/`
   - `taskmanagement.service` → `/etc/systemd/system/`

4. **EC2 上でサービス起動**
   - 環境変数ファイル（`app.env`）を EC2 上に作成
   - `systemctl enable --now taskmanagement`
   - `systemctl restart nginx`

5. **動作確認後の削除**
   ```bash
   cd terraform && terraform destroy
   ```

## アプリの環境変数

本番デプロイ時は以下の環境変数を EC2 上の `app.env` ファイルで設定する。
詳細な設定値は `terraform/terraform.tfvars`（Git 管理外）を参照。

| 変数名 | 説明 |
|-------|------|
| `DB_HOST` | RDS エンドポイント（`terraform output rds_address` で確認） |
| `DB_PORT` | データベースポート（5432） |
| `DB_NAME` | データベース名 |
| `DB_USERNAME` | DB ユーザー名 |
| `DB_PASSWORD` | DB パスワード |
| `DDL_AUTO` | Hibernate DDL 設定（本番: `update`） |
| `SQL_INIT_MODE` | SQL 初期化モード（本番: `never`） |
| `CORS_ALLOWED_ORIGINS` | CORS 許可オリジン（EC2 の IP アドレス） |
