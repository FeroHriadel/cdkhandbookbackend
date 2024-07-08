import React from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';

const AdminLayout = ({ children }: Readonly<{children: React.ReactNode}>) => {
  return (
    <>
      <AdminRouteGuard/>
      {children}
    </>
  )
}

export default AdminLayout