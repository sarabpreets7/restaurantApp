import { io, Socket } from 'socket.io-client';
import { Order } from './api';

export const connectOrderSocket = (orderId?: string): Socket => {
  return io(process.env.NEXT_PUBLIC_WS_BASE ?? 'ws://localhost:4000/ws/orders', {
    transports: ['websocket'],
    query: orderId ? { orderId } : undefined
  });
};

export type OrderEventHandler = (order: Order) => void;
