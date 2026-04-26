export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority | null;
  status: Status | null;
  position: number | null;
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: Priority | null;
  status?: Status;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority | null;
  status?: Status;
  dueDate?: string | null;
  position?: number;
}
