以下の手順でサーバーを起動してください。

## ルール（必ず守ること）

ポート競合が発生した場合は、**別ポートへの変更は禁止**。必ず競合プロセスを停止してから指定ポートで起動する。

| サーバー | 指定ポート |
| ------- | ---------- |
| バックエンド（Spring Boot） | `8080` |
| フロントエンド（Vite） | `5173` |

## 手順

### Step 1: ポート競合チェックと解消

```bash
# 8080番ポートの確認と停止
lsof -ti:8080 && kill $(lsof -ti:8080) && echo "8080を解放しました" || echo "8080は空きです"

# 5173番ポートの確認と停止
lsof -ti:5173 && kill $(lsof -ti:5173) && echo "5173を解放しました" || echo "5173は空きです"
```

### Step 2: PostgreSQL（Docker）起動

```bash
docker compose up -d
```

起動後に `docker ps` でコンテナが Running になっていることを確認する。

### Step 3: バックエンド起動（port 8080）

```bash
cd backend && ./gradlew bootRun > /tmp/backend.log 2>&1 &
```

起動確認（Spring Boot の起動には約15秒かかる）:

```bash
sleep 15 && curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/tasks
```

レスポンスが `200` であれば正常。

### Step 4: フロントエンド起動（port 5173）

```bash
cd frontend && npm run dev > /tmp/frontend.log 2>&1 &
```

起動確認:

```bash
sleep 3 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

レスポンスが `200` であれば正常。

### Step 5: 疎通確認

```bash
curl -s http://localhost:5173/api/tasks | head -c 100
```

タスクデータが返れば完了。ブラウザで http://localhost:5173 を開いてカンバンボードを確認する。
