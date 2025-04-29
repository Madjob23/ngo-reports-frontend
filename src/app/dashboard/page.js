import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import Report from '@/models/Report';
import User from '@/models/User';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({ searchParams }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.role !== 'admin') {
    redirect('/');
  }
  
  await connectDB();

  const params = await searchParams;
  const month = params?.month || '';
  
  let dashboardData;
  let reportsForMonth = [];
  
  if (month) {
    // If month is selected, fetch individual reports for that month
    const reports = await Report.find({ month });
    
    // Get all unique NGO IDs from the reports
    const ngoIds = [...new Set(reports.map(report => report.ngoId))];
    
    // Fetch all NGO users that match these IDs in a single query
    const ngoUsers = await User.find({ 
      role: 'ngo', 
      ngoId: { $in: ngoIds } 
    });
    
    // Create a map of ngoId -> name for quick lookups
    const ngoNameMap = {};
    ngoUsers.forEach(ngoUser => {
      ngoNameMap[ngoUser.ngoId] = ngoUser.name;
    });
    
    // Convert to plain objects with NGO names from the map
    reportsForMonth = reports.map(report => {
      const reportObj = {
        _id: report._id.toString(),
        ngoId: report.ngoId,
        ngoName: ngoNameMap[report.ngoId] || 'Unknown NGO',
        month: report.month || '',
        peopleHelped: report.peopleHelped || 0,
        eventsConducted: report.eventsConducted || 0,
        fundsUtilized: report.fundsUtilized || 0,
        createdAt: report.createdAt ? report.createdAt.toISOString() : '',
        updatedAt: report.updatedAt ? report.updatedAt.toISOString() : ''
      };
      
      return reportObj;
    });
    
    const result = await Report.aggregate([
      { $match: { month } },
      {
        $group: {
          _id: null,
          totalNGOs: { $addToSet: '$ngoId' },
          totalPeopleHelped: { $sum: '$peopleHelped' },
          totalEventsConducted: { $sum: '$eventsConducted' },
          totalFundsUtilized: { $sum: '$fundsUtilized' }
        }
      },
      {
        $project: {
          _id: 0,
          totalNGOs: { $size: '$totalNGOs' },
          totalPeopleHelped: 1,
          totalEventsConducted: 1,
          totalFundsUtilized: 1
        }
      }
    ]);
    
    // If no data found for the specific month, return zeros
    dashboardData = result.length > 0 ? result[0] : {
      month,
      totalNGOs: 0,
      totalPeopleHelped: 0,
      totalEventsConducted: 0,
      totalFundsUtilized: 0
    };
  } else {
    // If no month is provided, calculate all-time totals
    const result = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalNGOs: { $addToSet: '$ngoId' },
          totalPeopleHelped: { $sum: '$peopleHelped' },
          totalEventsConducted: { $sum: '$eventsConducted' },
          totalFundsUtilized: { $sum: '$fundsUtilized' }
        }
      },
      {
        $project: {
          _id: 0,
          totalNGOs: { $size: '$totalNGOs' },
          totalPeopleHelped: 1,
          totalEventsConducted: 1,
          totalFundsUtilized: 1
        }
      }
    ]);
    
    dashboardData = result.length > 0 ? result[0] : {
      totalNGOs: 0,
      totalPeopleHelped: 0,
      totalEventsConducted: 0,
      totalFundsUtilized: 0
    };
  }
  
  const availableMonths = await Report.distinct('month');
  availableMonths.sort().reverse(); // Sort in descending order
  
  return <DashboardClient 
    initialData={dashboardData} 
    initialMonth={month}
    reportsForMonth={reportsForMonth}
    availableMonths={availableMonths}
  />;
}