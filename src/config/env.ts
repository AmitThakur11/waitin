import { Platform } from 'react-native';

/**
 * Base URL of the carplay_backend API.
 *
 * Android emulator reaches the host machine via 10.0.2.2, iOS simulator via
 * localhost. For physical devices, replace with your machine's LAN IP.
 */
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const env = {
  apiBaseUrl: __DEV__ ? `http://${DEV_HOST}:3000/api` : 'https://anja-nonfragile-jaycee.ngrok-free.dev',
};
