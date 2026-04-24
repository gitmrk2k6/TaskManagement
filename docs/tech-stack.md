# 技術スタック候補

関連: [要件定義書](requirements.md)

> 本書は **候補段階** です。最終的な技術選定は後続講義の指示に従って確定します。

## 1. 全体構成（想定）

| レイヤ | 候補 | 備考 |
| --- | --- | --- |
| 言語 | Java 17 以上 | RaiseTech AIエンジニアコースの学習対象 |
| フレームワーク | Spring Boot 3.x | 先行講義でも扱われる予定 |
| ビルドツール | Maven または Gradle | 講義指定に従う |
| テンプレートエンジン | Thymeleaf | サーバサイドレンダリング |
| DB | MySQL 8.x または PostgreSQL 15+ | 講義指定に従う |
| ORM | Spring Data JPA (Hibernate) | エンティティマッピング |
| マイグレーション | Flyway（候補） | スキーマ管理 |
| 認証 | Spring Security | フォーム認証 |

## 2. 開発環境（想定）

| 項目 | 候補 |
| --- | --- |
| IDE | IntelliJ IDEA / VS Code |
| JDK | Eclipse Temurin 17 |
| DB（ローカル） | Docker上で MySQL or PostgreSQL |
| バージョン管理 | Git / GitHub |
| テスト | JUnit 5 |

## 3. 未確定事項

- フロントエンド方針（Thymeleaf のみ or 一部SPA化）
- ドラッグ&ドロップの実現方法（SortableJS, HTML5 Drag and Drop API 等）
- デプロイ先（ローカルのみ / クラウド）

## 4. 選定理由（候補段階）

- **Spring Boot**: Java Web開発のデファクト。公式ドキュメントが充実し学習しやすい
- **Thymeleaf**: Spring Boot と親和性が高く、サーバサイドで完結できる
- **Spring Data JPA**: ER図からエンティティクラスへの変換がシンプル
- **Spring Security**: 認証・認可の実装を標準化できる
