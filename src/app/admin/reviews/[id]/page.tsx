'use client';

import ReviewEditor from '@/components/admin/ReviewEditor';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { use } from 'react';

interface EditReviewPageProps {
  params: Promise<{ id: string }>;
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = use(params);

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <ReviewEditor reviewId={id} />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
