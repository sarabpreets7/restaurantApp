"use client";

import React from 'react';
import { Providers } from '../../providers';
import { OrderTracker } from '../../../components/OrderTracker';

export default function Track({ params }: { params: { orderId: string } }) {
  return (
    <Providers>
      <OrderTracker orderId={params.orderId} />
    </Providers>
  );
}
