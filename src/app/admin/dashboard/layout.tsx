'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
