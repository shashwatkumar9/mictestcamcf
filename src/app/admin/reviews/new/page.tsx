'use client';

import ReviewEditor from '@/components/admin/ReviewEditor';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function NewReviewPage() {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <ReviewEditor />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
