# プロトタイプ（画面イメージ確認用）

[画面設計書](../docs/screen-design.md) の内容を HTML/CSS/JavaScript で簡易実装したもの。
**画面イメージの認識合わせ用** で、本実装（Java/Spring Boot）の前段として作成。

## 動作確認方法

ブラウザで [`index.html`](index.html) を直接開くだけ。サーバー不要。

```bash
open prototype/index.html   # macOS
```

## 画面構成

| 画面 | ファイル | 対応要件 |
| --- | --- | --- |
| SC-01 ログイン | [index.html](index.html) | F-02 |
| SC-02 新規登録 | [register.html](register.html) | F-01 |
| SC-03 ボード一覧 | [boards.html](boards.html) | F-03〜F-05 |
| SC-04 ボード詳細 | [board.html](board.html) | F-06〜F-10 |

## データ保持

- LocalStorage を使用（バックエンド無し）
  - `tm_user`: ログイン中ユーザー情報（email, displayName）
  - `tm_boards`: ボード・リスト・カードのツリー構造
- ブラウザを変えたり LocalStorage をクリアするとデータは消えます

## 実装済み機能（MVP相当）

- ログイン / 新規登録（実認証なし。メール形式チェック + パスワード8文字以上のバリデーション）
- ボード作成 / 名前変更 / 削除
- 新規ボード作成時は `ToDo / Doing / Done` の初期リストを自動生成
- リスト作成 / 名前変更 / 削除
- カード作成 / 削除
- カードのドラッグ&ドロップ（同一リスト内の並び替え・別リスト間の移動）

## 実装していないこと

- 実際のバックエンド連携（すべてフロントのみ）
- パスワードのハッシュ化（セキュリティは本実装で Spring Security に任せる）
- カード詳細（期限・ラベル・コメント等、任意機能）
- レスポンシブ対応（PC想定のレイアウト）

## 本実装への引き継ぎポイント

- 画面レイアウト・導線は本プロトタイプを踏襲
- Thymeleaf テンプレート化する際、LocalStorage に保存しているデータ構造はそのまま DB の [ER図](../docs/database-design.md) の構造に対応している
