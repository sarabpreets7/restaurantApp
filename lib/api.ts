import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api'
});

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  dietary: string[];
  imageUrl: string;
  prepMinutes: number;
  available: boolean;
  stock: number;
  addOns?: { id: string; label: string; price: number }[];
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'failed';

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  customer: { name: string; phone: string; table?: string };
  lines: Array<{
    menuItemId: string;
    quantity: number;
    addOnIds?: string[];
    specialInstructions?: string;
    unitPrice: number;
    addOnTotal: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

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
