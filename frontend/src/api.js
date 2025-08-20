// src/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const signup = async (name, email, password, role) => {
  return api.post('/auth/signup', { name, email, password, role });
};

// --- Patients ---
export const registerPatient = async (patientData) => {
  return api.post('/patients', patientData);
};

export const getPatients = async () => {
  const token = localStorage.getItem('token');
  console.log('getPatients: token', token);
  try {
    const res = await api.get('/patients');
    return res;
  } catch (err) {
    console.error('getPatients error:', err?.response || err);
    throw err;
  }
};

export const deletePatient = async (patientId) => {
  return api.delete(`/patients/${patientId}`);
};

// --- Prescriptions (Appointments) ---
export const createPrescription = async (prescriptionData) => {
  return api.post('/prescriptions', prescriptionData);
};

export const getPrescriptions = async () => {
  const token = localStorage.getItem('token');
  console.log('getPrescriptions: token', token);
  try {
    const res = await api.get('/prescriptions');
    return res;
  } catch (err) {
    console.error('getPrescriptions error:', err?.response || err);
    throw err;
  }
};

// --- Billing ---
export const createBill = async (billData) => {
  return api.post('/bills', billData);
};

export const updateBill = async (billId, updateData) => {
  return api.patch(`/bills/${billId}`, updateData);
};

export const payBill = async (billId, paymentMethodId) => {
  return api.post('/bills/pay', { billId, paymentMethodId });
};

export const getBills = async () => {
  return api.get('/bills');
};

export const deleteBill = async (billId) => {
  return api.delete(`/bills/${billId}`);
};

// --- Tokens ---
export const generateToken = async () => {
  return api.post('/tokens/generate');
};

export const getTokens = async () => {
  return api.get('/tokens');
};

// --- History ---
export const getHistory = async () => {
  return api.get('/history');
}; 