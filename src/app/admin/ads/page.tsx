'use client';

import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdManager } from '@/components/admin/AdManager';

export default function AdminAdsPage() {
  return (
    <AdminAuthGuard requireAdmin={false}>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <AdManager />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
