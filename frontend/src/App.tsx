import { useState, useEffect } from 'react';
import { fetchTasks } from './api';
import type { Task } from './types';
import { BoardColumn } from './components/BoardColumn';
import { FilterBar } from './components/FilterBar';
import { TaskCreateModal } from './components/TaskCreateModal';
import './style.css';

const COLUMNS: { status: string; label: string }[] = [
  { status: 'todo',  label: '未着手' },
  { status: 'doing', label: '進行中' },
  { status: 'done',  label: '完了' },
];

export default function App() {
  const [filterStatus, setFilterStatus]     = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [tasks, setTasks]                   = useState<Task[]>([]);
  const [error, setError]                   = useState<string | null>(null);
  const [createOpen, setCreateOpen]         = useState(false);
  const [refreshKey, setRefreshKey]         = useState(0);

  useEffect(() => {
    setError(null);
    fetchTasks({ status: filterStatus, priority: filterPriority })
      .then(setTasks)
      .catch((e: Error) => setError(e.message));
  }, [filterStatus, filterPriority, refreshKey]);

  return (
    <div className="board-page">
      <header className="header header-solid">
        <h1>タスクボード</h1>
        <div className="header-actions">
          <FilterBar
            status={filterStatus}
            priority={filterPriority}
            onStatusChange={setFilterStatus}
            onPriorityChange={setFilterPriority}
          />
          <button
            type="button"
            className="btn btn-primary new-task-btn"
            onClick={() => setCreateOpen(true)}
          >
            ＋ 新規タスク
          </button>
        </div>
      </header>

      {error && <p style={{ color: '#eb5a46', padding: '1rem' }}>エラー: {error}</p>}

      <div className="board-detail">
        <div className="lists-container">
          {COLUMNS.map(({ status, label }) => (
            <BoardColumn
              key={status}
              title={label}
              tasks={tasks.filter((t) => t.status === status)}
            />
          ))}
        </div>
      </div>

      <TaskCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
