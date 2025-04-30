'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions';
import { toast } from 'sonner';

const Navbar = () => {
  const { user, clearAuth, isAuthenticated, isAdmin, isNGO } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (pathname === '/login') return null;
  
  if (!isAuthenticated()) return null;

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          NGO Impact System
        </Link>

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
              <>
                <Link href="/dashboard" className={`hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-300' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/admin/register" className={`hover:text-blue-300 ${pathname === '/admin/register' ? 'text-blue-300' : ''}`}>
                  Register User
                </Link>
                <Link href="/admin/users" className={`hover:text-blue-300 ${pathname === '/admin/users' ? 'text-blue-300' : ''}`}>
                  Manage Users
                </Link>
              </>
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
      </div>
    </nav>
  );
};

export default Navbar;