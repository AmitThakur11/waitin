import { api } from './client';

export type NotificationItem = {
  id: string;
  readAt: string | null;
  createdAt: string;
  actionType: string;
  message: string | null;
  car: { id: string; nickname: string | null; displayLabel: string | null };
};

export async function listNotifications(): Promise<NotificationItem[]> {
  return (await api.get('/notifications')).data;
}

export async function markAllRead(): Promise<void> {
  await api.post('/notifications/read-all');
}
