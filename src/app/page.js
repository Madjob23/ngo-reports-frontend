// src/app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isNGO } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const navigateTo = (path) => {
    router.push(path);
  };

  if (!isAuthenticated()) {
    return null; // Will be redirected to login
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">NGO Impact Reporting System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isNGO() && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Monthly Report</CardTitle>
              <CardDescription>
                Report your NGO&apos;s monthly impact metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Submit data about the number of people helped, events conducted,
                and funds utilized during the month.
              </p>
              <Button onClick={() => navigateTo('/reports/submit')}>
                Submit Report
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>View Reports</CardTitle>
            <CardDescription>
              {isAdmin() ? 'View reports from all NGOs' : 'View your submitted reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {isAdmin() 
                ? 'Access and manage reports submitted by all NGOs.'
                : 'Review and edit your previously submitted reports.'
              }
            </p>
            <Button onClick={() => navigateTo('/reports')}>
              View Reports
            </Button>
          </CardContent>
        </Card>
        
        {isAdmin() && (
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                View aggregated impact metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                See total numbers for people helped, events conducted, and
                funds utilized across all NGOs.
              </p>
              <Button onClick={() => navigateTo('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}