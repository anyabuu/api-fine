import { apiClient } from './client';

export const registerUser = async (body) =>
  await apiClient('/register', { body, method: 'POST' });
export const loginUser = async (body) =>
  await apiClient('/login', { body, method: 'POST' });
export const getBalance = async (token) =>
  await apiClient('/balance', { method: 'GET', headers: token });
export const topUpBalance = async (body, token) =>
  await apiClient('/balance/top-up', { body, method: 'POST', headers: token });
export const changeEmail = async (body, token) =>
  await apiClient('/account/email', { body, method: 'PATCH', headers: token });
export const changePassword = async (body, token) =>
  await apiClient('/account/password', { body, method: 'PATCH', headers: token });
export const getUsers = async (token) =>
  await apiClient('/users', { headers: token });
export const makeFine = async (body, token) =>
  await apiClient('/fine', { body, method: 'POST', headers: token });
export const getFines = async (token) =>
  await apiClient('/fines', { headers: token });
export const payFine = async (param, token) =>
  await apiClient(`/pay/fine/${param}`, { method:'PATCH', headers: token });


