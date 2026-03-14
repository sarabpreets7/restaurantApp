"use client";

import React from 'react';
import { Providers } from '../providers';
import { AdminOrders } from '../../components/AdminOrders';

export default function AdminPage() {
  return (
    <Providers>
      <AdminOrders />
    </Providers>
  );
}
