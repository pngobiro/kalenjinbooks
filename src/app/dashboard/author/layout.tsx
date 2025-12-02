import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-neutral-cream">
            <DashboardSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
