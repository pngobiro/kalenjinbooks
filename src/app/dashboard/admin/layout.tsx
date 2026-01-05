import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-neutral-cream">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}