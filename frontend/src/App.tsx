import { useState, useEffect } from 'react';
import { fetchTasks, updateTask } from './api';
import type { Status, Task } from './types';
import { BoardColumn } from './components/BoardColumn';
import { FilterBar } from './components/FilterBar';
import { TaskCreateModal } from './components/TaskCreateModal';
import { TaskEditModal } from './components/TaskEditModal';
import './style.css';

const COLUMNS: { status: Status; label: string }[] = [
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
  const [editingTask, setEditingTask]       = useState<Task | null>(null);
  const [draggingId, setDraggingId]         = useState<number | null>(null);
  const [refreshKey, setRefreshKey]         = useState(0);

  useEffect(() => {
    setError(null);
    fetchTasks({ status: filterStatus, priority: filterPriority })
      .then(setTasks)
      .catch((e: Error) => setError(e.message));
  }, [filterStatus, filterPriority, refreshKey]);

  const tasksByColumn = (status: Status): Task[] =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const handleDrop = async (taskId: number, targetStatus: Status, targetIndex: number) => {
    const original = tasks.find((t) => t.id === taskId);
    if (!original) return;
    if (original.status === targetStatus && original.position === targetIndex) return;

    try {
      await updateTask(taskId, { status: targetStatus, position: targetIndex });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setError((e as Error).message);
    }
  };

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
              status={status}
              title={label}
              tasks={tasksByColumn(status)}
              draggingId={draggingId}
              onEdit={setEditingTask}
              onDragStart={(task) => setDraggingId(task.id)}
              onDragEnd={() => setDraggingId(null)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <TaskCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />

      <TaskEditModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSaved={() => setRefreshKey((k) => k + 1)}
        onDeleted={() => { setEditingTask(null); setRefreshKey((k) => k + 1); }}
      />
    </div>
  );
}
