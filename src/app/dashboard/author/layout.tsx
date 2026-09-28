import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFCF5' }}>
            <DashboardSidebar />
            <main id="main-content" className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

