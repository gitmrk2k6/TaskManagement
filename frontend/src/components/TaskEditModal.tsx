import { useState } from 'react';
import { deleteTask, updateTask } from '../api';
import type { Priority, Status, Task, UpdateTaskInput } from '../types';

interface Props {
  task: Task | null;
  onClose: () => void;
  onSaved: (task: Task) => void;
  onDeleted: () => void;
}

interface FormState {
  title: string;
  description: string;
  priority: Priority | '';
  status: Status;
  dueDate: string;
}

function toFormState(task: Task): FormState {
  return {
    title: task.title,
    description: task.description ?? '',
    priority: (task.priority ?? '') as Priority | '',
    status: (task.status ?? 'todo') as Status,
    dueDate: task.dueDate ?? '',
  };
}

export function TaskEditModal({ task, onClose, onSaved, onDeleted }: Props) {
  const [prevTask, setPrevTask] = useState<Task | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (task !== prevTask) {
    setPrevTask(task);
    setForm(task ? toFormState(task) : null);
    if (task) setError(null);
  }

  if (!task || !form) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!window.confirm(`「${task.title}」を削除しますか？`)) return;
    setSubmitting(true);
    try {
      await deleteTask(task.id);
      onDeleted();
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateTaskInput = {
        title: form.title.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        priority: form.priority || null,
        status: form.status,
        dueDate: form.dueDate ? form.dueDate : null,
      };
      const saved = await updateTask(task.id, payload);
      onSaved(saved);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">タスクの編集</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-field">
            <span>タイトル<span className="required">*</span></span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              autoFocus
              maxLength={200}
            />
          </label>

          <label className="modal-field">
            <span>説明</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </label>

          <div className="modal-row">
            <label className="modal-field">
              <span>優先度</span>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as Priority | '' })
                }
              >
                <option value="">未設定</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </label>

            <label className="modal-field">
              <span>ステータス</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                <option value="todo">未着手</option>
                <option value="doing">進行中</option>
                <option value="done">完了</option>
              </select>
            </label>

            <label className="modal-field">
              <span>期限</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </label>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="btn btn-danger"
            >
              削除
            </button>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              キャンセル
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
