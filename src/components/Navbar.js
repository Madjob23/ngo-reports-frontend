// src/components/Navbar.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isNGO } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // If not authenticated and not on login page, redirect to login
  useEffect(() => {
    if (!isAuthenticated() && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Don't show navbar on login page
  if (pathname === '/login') return null;

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          NGO Impact System
        </Link>

        {isAuthenticated() && (
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex gap-4">
              {isNGO() && (
                <Link href="/reports/submit" className={`hover:text-blue-300 ${pathname === '/reports/submit' ? 'text-blue-300' : ''}`}>
                  Submit Report
                </Link>
              )}
              <Link href="/reports" className={`hover:text-blue-300 ${pathname === '/reports' ? 'text-blue-300' : ''}`}>
                View Reports
              </Link>
              {isAdmin() && (
                <Link href="/dashboard" className={`hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-300' : ''}`}>
                  Dashboard
                </Link>
              )}
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {user?.name} ({user?.role})
              </span>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;