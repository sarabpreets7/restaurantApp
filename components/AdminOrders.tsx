import React, { useEffect } from 'react';
import { Order, fetchOrders, updateStatus, fetchMenu } from '../lib/api';
import { connectOrderSocket } from '../lib/socket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatINR } from '../lib/money';

const nextStatus: Record<Order['status'], Order['status'] | null> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  failed: null
};

export const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    refetch: refetchOrders
  } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders, refetchOnWindowFocus: false });
  const { data: menu } = useQuery({
    queryKey: ['menu-admin'],
    queryFn: fetchMenu,
    staleTime: 5 * 60 * 1000
  });
  const addOnLabel = React.useCallback(
    (menuItemId: string, addOnId: string) => {
      const item = menu?.find((m) => m.id === menuItemId);
      return item?.addOns?.find((a) => a.id === addOnId)?.label ?? addOnId;
    },
    [menu]
  );

  useEffect(() => {
    const socket = connectOrderSocket();
    socket.on('admin.orders', (order: Order) => {
      queryClient.setQueryData<Order[]>(['orders'], (old = []) => {
        const existing = old.find((o) => o.id === order.id);
        if (existing) {
          return old.map((o) => (o.id === order.id ? order : o));
        }
        return [order, ...old];
      });
    });
    return () => socket.disconnect();
  }, [queryClient]);

  const advance = async (order: Order) => {
    const next = nextStatus[order.status];
    if (!next) return;
    await updateStatus(order.id, next, order.version);
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  if (isLoading) return <div className="glass" style={{ padding: 16 }}>Loading orders…</div>;
  if (isError) return (
    <div className="glass" style={{ padding: 16 }}>
      Failed to load orders.
      <button style={{ marginLeft: 8 }} onClick={() => refetchOrders()}>Retry</button>
    </div>
  );
  if (!data?.length) {
    return (
      <div className="glass" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Kitchen Dashboard</h2>
        <div style={{ color: 'var(--muted)' }}>No orders yet. They’ll appear here in real time.</div>
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Kitchen Dashboard</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {data.map((order) => (
          <div key={order.id} style={{ border: '1px solid var(--border)', padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>#{order.id.slice(0, 6)}</strong>
              <span>{order.status.toUpperCase()}</span>
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 4 }}>
              {order.customer.name} • {order.customer.phone}
            </div>
            <ul>
              {order.lines.map((line) => (
                <li key={line.menuItemId}>
                  x{line.quantity} — {line.menuItemId.slice(0, 4)} ({formatINR(line.unitPrice)})
                  {line.addOnIds?.length ? (
                    <span style={{ color: 'var(--muted)', marginLeft: 6 }}>
                      + {line.addOnIds.map((id) => addOnLabel(line.menuItemId, id)).join(', ')}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{formatINR(order.total)}</div>
              {nextStatus[order.status] && (
                <button onClick={() => advance(order)}>Mark {nextStatus[order.status]}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
