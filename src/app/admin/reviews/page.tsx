'use client';

import ReviewList from '@/components/admin/ReviewList';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminReviewsPage() {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <ReviewList />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
