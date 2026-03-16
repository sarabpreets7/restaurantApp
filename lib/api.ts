import axios from 'axios';
import type { MenuItem, Order, OrderStatus } from '../../shared/types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api'
});

export const fetchMenu = async (filters?: {
  search?: string;
  category?: string;
  dietary?: string;
  minPrice?: number;
  maxPrice?: number;
}) => (await api.get<MenuItem[]>('/menu', { params: filters })).data;

export const createOrder = async (payload: {
  lines: Array<{ menuItemId: string; quantity: number; addOnIds?: string[]; specialInstructions?: string }>;
  customer: { name: string; phone: string; table?: string };
  mockPaymentIntent?: 'force-success' | 'force-fail';
}) => (await api.post<Order>('/orders', payload)).data;

export const fetchOrder = async (id: string) => (await api.get<Order>(`/orders/${id}`)).data;

export const fetchOrders = async () => (await api.get<Order[]>('/orders')).data;

export const updateStatus = async (id: string, status: OrderStatus) =>
  (await api.patch<Order>(`/orders/${id}/status`, { status })).data;
