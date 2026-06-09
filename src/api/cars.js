import { api } from './client';

export async function listCars() {
  return (await api.get('/cars')).data;
}

export async function createCar(input) {
  return (await api.post('/cars', input)).data;
}

export async function getCar(id) {
  return (await api.get(`/cars/${id}`)).data;
}

export async function deleteCar(id) {
  await api.delete(`/cars/${id}`);
}

export async function getQr(id) {
  return (await api.get(`/cars/${id}/qr`)).data;
}

export async function rotateQr(id) {
  return (await api.post(`/cars/${id}/qr/rotate`)).data;
}

export async function updateDisplay(id, patch) {
  return (await api.patch(`/cars/${id}/display`, patch)).data;
}
