import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// User APIs
export const createUser = (userData) => API.post('/users/new', userData);
export const getAllUsers = () => API.get('/users/all');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Invoice APIs
export const createInvoice = (invoiceData) => API.post('/invoices/new', invoiceData);
export const getAllInvoices = () => API.get('/invoices/all');
export const getInvoiceById = (id) => API.get(`/invoices/${id}`);
export const updateInvoice = (id, invoiceData) => API.put(`/invoices/${id}`, invoiceData);
export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);

// Payment APIs
export const createPaymentLink = (paymentData) => API.post('/payments/create-payment-link', paymentData);