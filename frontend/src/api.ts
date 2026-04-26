import type { CreateTaskInput, Task } from './types';

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
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    if (detail?.errors) {
      const messages = Object.entries(detail.errors as Record<string, string>)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
      throw new Error(messages || `Create failed: ${res.status}`);
    }
    throw new Error(`Create failed: ${res.status}`);
  }
  return res.json();
}
