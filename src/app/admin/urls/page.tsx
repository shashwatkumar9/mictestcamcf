'use client';

import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UrlManager } from '@/components/admin/UrlManager';

export default function AdminUrlsPage() {
  return (
    <AdminAuthGuard requireAdmin={false}>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <UrlManager />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
