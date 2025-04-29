import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import Report from '@/models/Report';
import EditForm from './EditForm';

export default async function EditReportPage({ params }) {
  const { id } =  await params;
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  await connectDB();
  
  const report = await Report.findById(id);
  
  if (!report) {
    notFound();
  }
  
  // Check if NGO is trying to edit someone else's report
  if (user.role === 'ngo' && report.ngoId !== user.ngoId) {
    redirect('/reports');
  }
  
  // Convert to plain object
  const serializedReport = {
    _id: report._id.toString(),
    ngoId: report.ngoId,
    month: report.month,
    peopleHelped: report.peopleHelped,
    eventsConducted: report.eventsConducted,
    fundsUtilized: report.fundsUtilized,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString()
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <EditForm report={serializedReport} user={user} />
    </div>
  );
}