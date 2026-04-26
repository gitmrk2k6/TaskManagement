import { useState, useRef } from 'react';
import type { Status, Task } from '../types';
import { TaskCard } from './TaskCard';

interface Props {
  status: Status;
  title: string;
  tasks: Task[];
  draggingId: number | null;
  onEdit: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (taskId: number, targetStatus: Status, targetIndex: number) => void;
}

export function BoardColumn({
  status,
  title,
  tasks,
  draggingId,
  onEdit,
  onDragStart,
  onDragEnd,
  onDrop,
}: Props) {
  const [hover, setHover] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const computeTargetIndex = (clientY: number): number => {
    const container = cardsRef.current;
    if (!container) return tasks.length;
    const cardEls = Array.from(container.querySelectorAll<HTMLElement>('.card'));
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return cardEls.length;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHover(false);
    const idStr = e.dataTransfer.getData('text/plain');
    const taskId = Number(idStr);
    if (!taskId) return;

    let targetIndex = computeTargetIndex(e.clientY);
    // Same-column move: account for the dragged card being removed from its current position
    const draggedIndexInColumn = tasks.findIndex((t) => t.id === taskId);
    if (draggedIndexInColumn !== -1 && targetIndex > draggedIndexInColumn) {
      targetIndex -= 1;
    }
    onDrop(taskId, status, targetIndex);
  };

  return (
    <div
      className={['list', hover ? 'drag-hover' : ''].filter(Boolean).join(' ')}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!hover) setHover(true);
      }}
      onDragLeave={(e) => {
        // Only clear hover when leaving the list element itself, not its children
        if (e.currentTarget === e.target) setHover(false);
      }}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h2>
          {title}
          <span className="list-count">{tasks.length}</span>
        </h2>
      </div>
      <div className="cards" ref={cardsRef}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggingId === task.id}
            onEdit={onEdit}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
