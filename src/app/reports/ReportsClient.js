'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ReportsClient({ reports, initialMonth, isAdmin }) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    router.push(`/reports${newMonth ? `?month=${newMonth}` : ''}`);
  };
  
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
              onChange={handleMonthChange}
              className="border rounded px-2 py-1"
            />
          </div>
          
          {/* Anyone can submit new reports */}
          <Button onClick={() => router.push('/reports/submit')}>
            Submit New Report
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
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
          {reports.map((report) => (
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
                      View
                    </Button>
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
                    <p className="text-2xl font-bold">{formatCurrency(report.fundsUtilized)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}