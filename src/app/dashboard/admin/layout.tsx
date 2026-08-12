import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-neutral-cream overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}