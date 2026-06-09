import { api } from './client';
import { saveTokens } from './tokenStore';

export type RequestOtpResult = { sent: boolean; delivered: boolean; devCode?: string };

export async function requestOtp(phone: string): Promise<RequestOtpResult> {
  const res = await api.post('/auth/request-otp', { phone });
  return res.data;
}

export async function verifyOtp(phone: string, code: string): Promise<void> {
  const res = await api.post('/auth/verify-otp', { phone, code });
  await saveTokens(res.data);
}
