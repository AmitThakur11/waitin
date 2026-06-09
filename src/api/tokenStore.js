import * as Keychain from 'react-native-keychain';

const SERVICE = 'carcall.auth';

export async function saveTokens(tokens) {
  await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
    service: SERVICE,
  });
}

export async function loadTokens() {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;
  try {
    return JSON.parse(creds.password);
  } catch {
    return null;
  }
}

export async function clearTokens() {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
