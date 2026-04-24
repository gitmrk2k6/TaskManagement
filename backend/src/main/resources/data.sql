-- 学習用: 起動毎にデータをリセットして投入（本番ではやらない）
TRUNCATE TABLE tasks RESTART IDENTITY;

INSERT INTO tasks (title, description, priority, status, position, due_date, created_at, updated_at) VALUES
('要件定義書のレビュー',       '第3回課題のスコープを確認',         'high',   'doing', 1, '2026-04-28', '2026-04-20 09:00:00', '2026-04-20 09:00:00'),
('PostgreSQL Docker 起動確認', 'docker compose up -d で接続確認',   'medium', 'done',  2, '2026-04-22', '2026-04-21 10:30:00', '2026-04-22 18:00:00'),
('Task エンティティ実装',      'JPA アノテーションを付与',          'high',   'done',  3, '2026-04-23', '2026-04-22 11:00:00', '2026-04-23 17:00:00'),
('READ API の実装',           'Controller/Service/Repository',     'high',   'todo',  4, '2026-04-26', '2026-04-25 09:00:00', '2026-04-25 09:00:00'),
('curl で動作確認',            'GET /api/tasks のレスポンス確認',   'medium', 'todo',  5, '2026-04-26', '2026-04-25 09:30:00', '2026-04-25 09:30:00'),
('CREATE API の設計',         'POST /api/tasks の要件整理',        'low',    'todo',  6, '2026-04-30', '2026-04-25 10:00:00', '2026-04-25 10:00:00'),
('週次振り返りの提出',         'RaiseTech 第3回の課題提出',         'medium', 'todo',  7, '2026-04-27', '2026-04-25 10:30:00', '2026-04-25 10:30:00');
