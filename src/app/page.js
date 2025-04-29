import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HomeButtons from '@/components/HomeButtons';

export default async function Home() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">NGO Impact Reporting System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'ngo' && (
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
              <HomeButtons route="/reports/submit" label="Submit Report" />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>View Reports</CardTitle>
            <CardDescription>
              {user.role === 'admin' ? 'View reports from all NGOs' : 'View your submitted reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {user.role === 'admin' 
                ? 'Access and manage reports submitted by all NGOs.'
                : 'Review and edit your previously submitted reports.'
              }
            </p>
            <HomeButtons route="/reports" label="View Reports" />
          </CardContent>
        </Card>
        
        {user.role === 'admin' && (
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
              <HomeButtons route="/dashboard" label="Go to Dashboard" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}