# TaskManagement

RaiseTech AI エンジニアコース 第3回講義で開発中の Trello 風タスク管理 Web アプリケーション。

## 概要

タスクをカードとして視覚的に管理できるカンバンボードアプリ。  
バックエンドは Spring Boot 4.x の REST API、フロントエンドは React（Vite）で構成された SPA。

## 技術スタック

| レイヤー | 技術 | バージョン |
| ------- | ---- | ---------- |
| バックエンド | Java / Spring Boot | Java 21 / Spring Boot 4.x |
| ビルドツール | Gradle | Gradle Wrapper 同梱 |
| フロントエンド | React + TypeScript | React 18 / Vite |
| DB | PostgreSQL | 17（Docker） |
| ORM | Spring Data JPA（Hibernate） | - |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## リポジトリ構成

```text
TaskManagement/
├── backend/           # Spring Boot（Gradle）
├── frontend/          # React + TypeScript（Vite）
├── prototype/         # 静的 HTML プロトタイプ（UIモック）
├── docker-compose.yml # PostgreSQL
├── docs/              # 設計ドキュメント
│   ├── requirements.md          # 要件定義書
│   ├── functional-requirements.md # 機能要件書
│   ├── screen-design.md         # 画面設計書
│   ├── database-design.md       # DB 設計書
│   └── tech-stack.md            # 技術スタック
└── CLAUDE.md          # Claude Code 開発ルール
```

## 前提条件

| ツール | バージョン |
| ----- | ---------- |
| Java | 21（LTS） |
| Node.js | 22 |
| Docker | 最新安定版 |
| Git | 最新安定版 |

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/gitmrk2k6/TaskManagement.git
cd TaskManagement
```

### 2. フロントエンドの依存パッケージをインストール

```bash
cd frontend && npm install
```

## 起動方法

> **ポート競合が発生した場合は必ず競合プロセスを停止してから指定ポートで再起動すること。**  
> 別ポートへの変更は禁止。詳細は [CLAUDE.md](CLAUDE.md) を参照。

### Step 1: PostgreSQL（Docker）

```bash
docker compose up -d
```

### Step 2: バックエンド（port 8080）

```bash
cd backend
./gradlew bootRun
```

### Step 3: フロントエンド（port 5173）

```bash
cd frontend
npm run dev
```

ブラウザで <http://localhost:5173> を開く。

## API エンドポイント

| メソッド | パス | 説明 | クエリパラメータ |
| ------- | ---- | ---- | -------------- |
| GET | `/api/tasks` | タスク一覧取得 | `status`（任意）、`priority`（任意） |
| GET | `/api/tasks/{id}` | タスク1件取得 | - |

### クエリパラメータの値

| パラメータ | 値 |
| --------- | -- |
| `status` | `todo` / `doing` / `done` |
| `priority` | `high` / `medium` / `low` |

### 使用例

```bash
# 全件取得
curl http://localhost:8080/api/tasks

# status でフィルタ
curl http://localhost:8080/api/tasks?status=todo

# status + priority で絞り込み
curl http://localhost:8080/api/tasks?status=doing&priority=high
```

## ドキュメント

| ドキュメント | 内容 |
| ----------- | ---- |
| [要件定義書](docs/requirements.md) | プロジェクト概要・目的・スコープ |
| [機能要件書](docs/functional-requirements.md) | 機能一覧・機能詳細・ユースケース |
| [画面設計書](docs/screen-design.md) | 画面一覧・遷移図・ワイヤーフレーム |
| [DB 設計書](docs/database-design.md) | ER 図・テーブル定義・インデックス |
| [技術スタック](docs/tech-stack.md) | 採用技術・選定理由 |

## 開発ルール

- ブランチ戦略・コミットメッセージ規約・Claude Code の動作ルールは [CLAUDE.md](CLAUDE.md) を参照
- Issue → ブランチ → PR のフローを必ず守ること
