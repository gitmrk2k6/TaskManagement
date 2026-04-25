# 技術スタック

関連: [要件定義書](requirements.md)

> 本書は **2026-04-24 講義時点の方針** を記載しています。今後の講義進行に伴い変更になる場合があります。

---

## 1. バックエンド

| 技術 | バージョン | 実装状況 | 備考 |
| --- | --- | --- | --- |
| Java | 21.0.5 (LTS) | ✅ 実装済み | Oracle JDK |
| Spring Boot | 4.0.6 | ✅ 実装済み | REST API サーバ |
| Spring Web MVC | Spring Boot 管理 | ✅ 実装済み | REST コントローラ |
| Spring Data JPA / Hibernate | Spring Boot 管理 | ✅ 実装済み | ORM・エンティティマッピング |
| PostgreSQL JDBC Driver | Spring Boot 管理 | ✅ 実装済み | DB 接続ドライバ |
| Gradle | Wrapper 同梱 | ✅ 実装済み | ビルドツール（Maven より記述が簡潔） |
| JUnit 5 | Spring Boot 管理 | ✅ 実装済み | バックエンド単体テスト |
| Flyway | - | 🔲 未実装 | DBマイグレーション（今後導入予定） |
| Spring Security + JWT | - | 🔲 未実装 | REST API 向けトークン認証（今後導入予定） |

---

## 2. フロントエンド

| 技術 | バージョン | 実装状況 | 備考 |
| --- | --- | --- | --- |
| React | 19.2.5 | ✅ 実装済み | SPA 構成（Next.js はコース対象外のため除外） |
| TypeScript | 6.0.2 | ✅ 実装済み | 型安全な開発 |
| Vite | 8.0.10 | ✅ 実装済み | 開発サーバ・バンドラ |
| ESLint | 10.2.1 | ✅ 実装済み | コード品質チェック（typescript-eslint / react-hooks / react-refresh） |

---

## 3. データベース

| 技術 | バージョン | 実装状況 | 備考 |
| --- | --- | --- | --- |
| PostgreSQL | 17 | ✅ 実装済み | Docker で起動（`docker compose up -d`） |
| Docker Compose | Docker 同梱 | ✅ 実装済み | ローカル DB 環境の管理 |

---

## 4. 開発ツール

| ツール | バージョン | 備考 |
| ----- | ---------- | ---- |
| Node.js | 22.17.0 | フロントエンドのランタイム |
| npm | 10.9.2 | パッケージ管理 |
| Docker | 28.3.0 | PostgreSQL コンテナ管理 |
| Git | 2.50.1 | バージョン管理 |
| GitHub | - | リモートリポジトリ・PR 管理 |
| VS Code / IntelliJ IDEA | - | IDE |

---

## 5. プロジェクト構成（リポジトリ内）

```text
TaskManagement/
├── backend/           # Spring Boot (Gradle)
├── frontend/          # React + TypeScript (Vite)
├── docker-compose.yml # PostgreSQL
├── docs/              # 設計ドキュメント
└── prototype/         # 静的 HTML プロトタイプ
```

---

## 6. 選定理由

- **Spring Boot + Gradle**: RaiseTech AI エンジニアコース指定。Gradle は Maven より記述が簡潔
- **React + TypeScript（Vite）**: SPA としてフロントとバックを完全分離。型安全性を確保
- **PostgreSQL**: コース指定。`user` 等の予約語回避が容易でスキーマ設計書と整合する
- **Docker**: ローカルに PostgreSQL をインストールせず、環境差異を排除する
- **Flyway**（未実装）: スキーマ変更を SQL ファイルとして管理し、チーム・複数環境での一貫性を担保
- **Spring Security + JWT**（未実装）: REST API のステートレス認証に適した標準的な構成
