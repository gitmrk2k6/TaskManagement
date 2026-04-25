import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface Props {
  title: string;
  tasks: Task[];
}

export function BoardColumn({ title, tasks }: Props) {
  return (
    <div className="list">
      <div className="list-header">
        <h2>
          {title}
          <span className="list-count">{tasks.length}</span>
        </h2>
      </div>
      <div className="cards">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
