# 技術スタック

関連: [要件定義書](requirements.md)

> 本書は **2026-04-24 講義時点の方針** を記載しています。今後の講義進行に伴い変更になる場合があります。

## 1. 全体構成

| レイヤ | 採用技術 | バージョン | 備考 |
| --- | --- | --- | --- |
| 言語（バックエンド） | Java | 21 (LTS) | ローカル環境で確認済み |
| フレームワーク | Spring Boot | 4.x | バックエンド API サーバ |
| ビルドツール | Gradle | - | Gradle Wrapper を同梱 |
| フロントエンド | React | 18 | SPA 構成（Next.js は対象外） |
| フロントエンドビルド | Vite | - | 開発サーバ・バンドラ |
| DB | PostgreSQL | 15 | Docker で起動 |
| ORM | Spring Data JPA (Hibernate) | - | エンティティマッピング |
| DBマイグレーション | Flyway | - | スキーマバージョン管理 |
| 認証 | Spring Security + JWT | - | REST API 向けトークン認証 |
| API 形式 | REST API (JSON) | - | フロントとバックを分離 |

## 2. 開発環境

| 項目 | 採用 | 備考 |
| --- | --- | --- |
| IDE | VS Code / IntelliJ IDEA | - |
| JDK | Java 21 (Oracle) | ローカル環境で確認済み |
| Node.js | v22 | npm v10 |
| DB（ローカル） | Docker + PostgreSQL 15 | docker-compose で管理 |
| バージョン管理 | Git / GitHub | - |
| テスト | JUnit 5 | バックエンド単体テスト |

## 3. プロジェクト構成（リポジトリ内）

```text
TaskManagement/
├── backend/           # Spring Boot (Gradle)
├── frontend/          # React (Vite)
├── docker-compose.yml # PostgreSQL
├── docs/
└── prototype/
```

## 4. 選定理由

- **Spring Boot + Gradle**: RaiseTech AIエンジニアコース指定。Gradle は Maven より記述が簡潔
- **React (Vite)**: SPA としてフロントとバックを完全分離。Next.js はコース対象外のため除外
- **PostgreSQL**: コース指定。`user` 等の予約語回避が容易でスキーマ設計書と整合する
- **Flyway**: スキーマ変更を SQL ファイルとして管理し、チーム・複数環境での一貫性を担保
- **Spring Security + JWT**: REST API のステートレス認証に適した標準的な構成
- **Docker**: ローカルに PostgreSQL をインストールせず、環境差異を排除する
