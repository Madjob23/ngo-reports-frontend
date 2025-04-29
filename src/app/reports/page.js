// src/app/reports/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import apiService from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { toast } from 'sonner';

export default function Reports() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('');

  // Fetch reports with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['reports', selectedMonth],
    queryFn: () => apiService.getReports(selectedMonth),
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await apiService.deleteReport(id);
      toast.success('Report deleted successfully', {
        description: 'The report has been deleted.',
      });
      refetch();
    } catch (error) {
      toast.error('Deletion failed', {
        description: error.message || 'An error occurred while deleting the report.',
      });
    }
  };

  if (!isAuthenticated()) {
    return null; // Will be redirected to login
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="month-filter" className="mr-2 text-sm">Filter by Month:</label>
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          
          <Button onClick={() => router.push('/reports/submit')}>
            Submit New Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading reports..." />
      ) : error ? (
        <ErrorDisplay 
          message={error.message || 'Failed to load reports'} 
          onRetry={refetch} 
        />
      ) : (
        <>
          {data?.reports?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-gray-500 mb-4">No reports found</p>
                <Button onClick={() => router.push('/reports/submit')}>
                  Submit New Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {data?.reports?.map((report) => (
                <Card key={report._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Report for {report.month}</CardTitle>
                        <CardDescription>NGO ID: {report.ngoId}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/reports/edit/${report._id}`)}
                        >
                          Edit
                        </Button>
                        {isAdmin() && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(report._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">People Helped</p>
                        <p className="text-2xl font-bold">{report.peopleHelped}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Events Conducted</p>
                        <p className="text-2xl font-bold">{report.eventsConducted}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Funds Utilized</p>
                        <p className="text-2xl font-bold">${report.fundsUtilized.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}