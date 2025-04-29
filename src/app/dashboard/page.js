// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import apiService from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function Dashboard() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('');

  // Get current month in YYYY-MM format
  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setSelectedMonth(`${year}-${month}`);
  }, []);

  // Fetch dashboard data with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dashboard', selectedMonth],
    queryFn: () => apiService.getDashboardData(selectedMonth),
    enabled: !!selectedMonth && isAuthenticated() && isAdmin(),
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else if (!isAdmin()) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated() || !isAdmin()) {
    return null; // Will be redirected
  }

  const dashboardData = data?.data || {
    totalNGOs: 0,
    totalPeopleHelped: 0,
    totalEventsConducted: 0,
    totalFundsUtilized: 0
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="month-filter" className="mr-2 text-sm">Select Month:</label>
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          
          <Button onClick={() => router.push('/reports')}>
            View All Reports
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading dashboard data..." />
      ) : error ? (
        <ErrorDisplay 
          message={error.message || 'Failed to load dashboard data'} 
          onRetry={refetch} 
        />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Summary for {selectedMonth || 'All Time'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">NGOs Reporting</CardTitle>
                <CardDescription>Total organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{dashboardData.totalNGOs}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">People Helped</CardTitle>
                <CardDescription>Total beneficiaries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{dashboardData.totalPeopleHelped}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Events Conducted</CardTitle>
                <CardDescription>Total activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{dashboardData.totalEventsConducted}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Funds Utilized</CardTitle>
                <CardDescription>Total expenditure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  ${dashboardData.totalFundsUtilized?.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {dashboardData.totalNGOs === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No data available for this period</h3>
                  <p className="text-gray-500 mb-4">
                    There are no reports submitted for the selected month.
                  </p>
                  <Button onClick={() => router.push('/reports/submit')}>
                    Submit a Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}