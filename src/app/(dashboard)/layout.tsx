'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdminView, setIsAdminView] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header
        isAdminView={isAdminView}
        onToggleView={() => setIsAdminView(!isAdminView)}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <div className="flex">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isAdminView={isAdminView}
          className={cn(
            // Mobile styles: fixed, slide in/out
            "md:translate-x-0 transition-transform duration-300",
            !mobileMenuOpen && "-translate-x-full md:translate-x-0"
          )}
        />

        <main
          className={cn(
            "flex-1 transition-all duration-300 w-full",
            sidebarCollapsed ? "md:ml-16" : "md:ml-64" // Only apply margin on desktop
          )}
        >
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
