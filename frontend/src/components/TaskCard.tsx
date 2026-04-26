import type { Task } from '../types';

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  high:   { label: '高', color: '#eb5a46' },
  medium: { label: '中', color: '#ff9f1a' },
  low:    { label: '低', color: '#0079bf' },
};

function dueDateStatus(dateStr: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0)  return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 2)  return 'soon';
  return null;
}

function formatDueDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface Props {
  task: Task;
  isDragging?: boolean;
  onEdit?: (task: Task) => void;
  onDragStart?: (task: Task) => void;
  onDragEnd?: () => void;
}

export function TaskCard({ task, isDragging, onEdit, onDragStart, onDragEnd }: Props) {
  const priority = task.priority ? PRIORITY_MAP[task.priority] : null;
  const dueStatus = task.dueDate ? dueDateStatus(task.dueDate) : null;

  return (
    <div
      className={['card', isDragging ? 'dragging' : ''].filter(Boolean).join(' ')}
      draggable
      data-task-id={task.id}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(task.id));
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(task);
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onEdit?.(task)}
    >
      {priority && (
        <span className="card-priority" style={{ background: priority.color }}>
          {priority.label}
        </span>
      )}
      <div className="card-title">{task.title}</div>
      {task.dueDate && (
        <div className="card-meta">
          <span className={['card-due', dueStatus].filter(Boolean).join(' ')}>
            📅 {formatDueDate(task.dueDate)}
          </span>
        </div>
      )}
    </div>
  );
}
