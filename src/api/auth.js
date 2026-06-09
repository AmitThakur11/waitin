import { api } from './client';
import { saveTokens } from './tokenStore';

export async function requestOtp(phone) {
  const res = await api.post('/auth/request-otp', { phone });
  return res.data;
}

export async function verifyOtp(phone, code) {
  const res = await api.post('/auth/verify-otp', { phone, code });
  await saveTokens(res.data);
}
