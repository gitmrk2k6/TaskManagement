import type { Task } from './types';

export async function fetchTasks(params: { status?: string; priority?: string } = {}): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params.status)   query.set('status', params.status);
  if (params.priority) query.set('priority', params.priority);
  const res = await fetch(`/api/tasks?${query}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
