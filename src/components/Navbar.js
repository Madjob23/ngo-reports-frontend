'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions';
import { toast } from 'sonner';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, clearAuth, isAuthenticated, isAdmin, isNGO } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    <nav className="bg-slate-800 text-white p-4 relative z-10">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          NGO Impact System
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded hover:bg-slate-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation and User Info */}
        <div 
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-6`}
        >
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            {isNGO() && (
              <Link 
                href="/reports/submit" 
                className={`hover:text-blue-300 ${pathname === '/reports/submit' ? 'text-blue-300' : ''} py-2 md:py-0`}
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Report
              </Link>
            )}
            <Link 
              href="/reports" 
              className={`hover:text-blue-300 ${pathname === '/reports' ? 'text-blue-300' : ''} py-2 md:py-0`}
              onClick={() => setIsMenuOpen(false)}
            >
              View Reports
            </Link>
            {isAdmin() && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-300' : ''} py-2 md:py-0`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/register" 
                  className={`hover:text-blue-300 ${pathname === '/admin/register' ? 'text-blue-300' : ''} py-2 md:py-0`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register User
                </Link>
                <Link 
                  href="/admin/users" 
                  className={`hover:text-blue-300 ${pathname === '/admin/users' ? 'text-blue-300' : ''} py-2 md:py-0`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Users
                </Link>
              </>
            )}
          </div>

          {/* User Info and Logout - show below links on mobile, beside on desktop */}
          <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-0 mt-4 md:mt-0">
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