'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DashboardClient({ initialData, initialMonth, reportsForMonth = [], availableMonths = [] }) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [dashboardData, setDashboardData] = useState(initialData);
  
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    router.push(`/dashboard${newMonth ? `?month=${newMonth}` : ''}`);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
              onChange={handleMonthChange}
              className="border rounded px-2 py-1"
            />
          </div>
          
          <Button onClick={() => router.push('/reports')}>
            View All Reports
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">NGOs Reporting</CardTitle>
            <CardDescription>Total organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.totalNGOs || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">People Helped</CardTitle>
            <CardDescription>Total beneficiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.totalPeopleHelped || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Events Conducted</CardTitle>
            <CardDescription>Total activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.totalEventsConducted || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Funds Utilized</CardTitle>
            <CardDescription>Total expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {formatCurrency(dashboardData.totalFundsUtilized || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Display reports list when a month is selected */}
      {selectedMonth && reportsForMonth.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Individual Reports for {selectedMonth}
          </h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NGO Name</TableHead>
                    <TableHead className="text-right">People Helped</TableHead>
                    <TableHead className="text-right">Events Conducted</TableHead>
                    <TableHead className="text-right">Funds Utilized</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsForMonth.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium">{report.ngoName}</TableCell>
                      <TableCell className="text-right">{report.peopleHelped}</TableCell>
                      <TableCell className="text-right">{report.eventsConducted}</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.fundsUtilized)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/reports/edit/${report._id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      
      {selectedMonth && reportsForMonth.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No data available for {selectedMonth}</h3>
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
    </div>
  );
}