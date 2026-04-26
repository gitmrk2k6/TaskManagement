import type { CreateTaskInput, Task, UpdateTaskInput } from './types';

async function parseApiError(res: Response, fallback: string): Promise<Error> {
  const detail = await res.json().catch(() => null);
  if (detail?.errors) {
    const messages = Object.entries(detail.errors as Record<string, string>)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(', ');
    return new Error(messages || fallback);
  }
  if (detail?.message) {
    return new Error(detail.message);
  }
  return new Error(fallback);
}

export async function fetchTasks(params: { status?: string; priority?: string } = {}): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params.status)   query.set('status', params.status);
  if (params.priority) query.set('priority', params.priority);
  const res = await fetch(`/api/tasks?${query}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await parseApiError(res, `Create failed: ${res.status}`);
  return res.json();
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await parseApiError(res, `Update failed: ${res.status}`);
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await parseApiError(res, `Delete failed: ${res.status}`);
}
