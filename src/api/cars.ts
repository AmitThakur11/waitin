import { api } from './client';

export type DisplaySettings = {
  showLabel: boolean;
  allowMessage: boolean;
  allowCall: boolean;
  allowChat: boolean;
};

export type Car = {
  id: string;
  nickname?: string | null;
  make?: string | null;
  model?: string | null;
  color?: string | null;
  plate?: string | null;
  photoUrl?: string | null;
  displayLabel?: string | null;
  settings?: DisplaySettings | null;
  createdAt: string;
};

export type CarInput = Partial<
  Pick<Car, 'nickname' | 'make' | 'model' | 'color' | 'plate' | 'displayLabel'>
>;

export type Qr = { token: string; shareUrl: string; pngDataUrl: string };

export async function listCars(): Promise<Car[]> {
  return (await api.get('/cars')).data;
}

export async function createCar(input: CarInput): Promise<Car> {
  return (await api.post('/cars', input)).data;
}

export async function getCar(id: string): Promise<Car> {
  return (await api.get(`/cars/${id}`)).data;
}

export async function deleteCar(id: string): Promise<void> {
  await api.delete(`/cars/${id}`);
}

export async function getQr(id: string): Promise<Qr> {
  return (await api.get(`/cars/${id}/qr`)).data;
}

export async function rotateQr(id: string): Promise<Qr> {
  return (await api.post(`/cars/${id}/qr/rotate`)).data;
}

export async function updateDisplay(
  id: string,
  patch: Partial<DisplaySettings>,
): Promise<DisplaySettings> {
  return (await api.patch(`/cars/${id}/display`, patch)).data;
}
