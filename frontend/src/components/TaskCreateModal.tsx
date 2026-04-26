import { useState } from 'react';
import { createTask } from '../api';
import type { CreateTaskInput, Priority, Status, Task } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

const INITIAL: CreateTaskInput = {
  title: '',
  description: '',
  priority: null,
  status: 'todo',
  dueDate: '',
};

export function TaskCreateModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateTaskInput>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setForm(INITIAL);
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
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
      const payload: CreateTaskInput = {
        title: form.title.trim(),
        description: form.description?.trim() ? form.description.trim() : null,
        priority: form.priority || null,
        status: form.status,
        dueDate: form.dueDate ? form.dueDate : null,
      };
      const created = await createTask(payload);
      onCreated(created);
      reset();
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
        <h2 className="modal-title">新規タスクの登録</h2>
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
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </label>

          <div className="modal-row">
            <label className="modal-field">
              <span>優先度</span>
              <select
                value={form.priority ?? ''}
                onChange={(e) =>
                  setForm({ ...form, priority: (e.target.value || null) as Priority | null })
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
                value={form.status ?? 'todo'}
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
                value={form.dueDate ?? ''}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </label>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={handleClose} disabled={submitting} className="btn btn-secondary">
              キャンセル
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? '登録中…' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
