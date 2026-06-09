import * as Keychain from 'react-native-keychain';

const SERVICE = 'carcall.auth';

export type AuthTokens = { accessToken: string; refreshToken: string };

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
    service: SERVICE,
  });
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;
  try {
    return JSON.parse(creds.password) as AuthTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
