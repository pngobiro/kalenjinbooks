'use client';

import { ReactNode } from 'react';

export default function BookLayout({ children }: { children: ReactNode }) {
    return (
        <div 
            className="book-viewer-layout min-h-screen"
            style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
            }}
        >
            {children}
        </div>
    );
}