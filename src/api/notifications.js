import { api } from './client';

export async function listNotifications() {
  return (await api.get('/notifications')).data;
}

export async function markAllRead() {
  await api.post('/notifications/read-all');
}
