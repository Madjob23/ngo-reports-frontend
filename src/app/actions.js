'use server'

import connectDB from '@/lib/db';
import Report from '@/models/Report';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function signToken(user) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const payload = { 
    userId: user._id.toString()
  };
  
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey);
}

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;
  
  // Import the verification function directly to avoid circular dependencies
  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function login(formData) {
  try {
    const username = formData.get('username');
    const password = formData.get('password');
    
    await connectDB();
    
    const user = await User.findOne({ username });
    
    if (user && (await user.comparePassword(password))) {
      const token = await signToken(user);
      
      // Set the auth cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      });
      
      return { 
        success: true, 
        user: {
          _id: user._id.toString(),
          username: user.username,
          role: user.role,
          ngoId: user.ngoId,
          name: user.name
        },
        token
      };
    } else {
      return {
        success: false, 
        message: 'Invalid username or password'
      };
    }
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      message: 'Server error', 
      error: error.message 
    };
  }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    
    return { success: true };
  }

export async function registerUser(formData) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await connectDB();
    
    const user = await getCurrentUser();
    
    if (user.role !== 'admin') {
      return { success: false, message: 'Only admin can register new users' };
    }
    
    const username = formData.get('username');
    const password = formData.get('password');
    const role = formData.get('role');
    const ngoId = formData.get('ngoId');
    const name = formData.get('name');
    
    if (!username || !password || !role || !name) {
      return { success: false, message: 'All fields are required' };
    }
    
    if (role === 'ngo' && !ngoId) {
      return { success: false, message: 'NGO ID is required for NGO users' };
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }
    
    await User.create({
      username,
      password,
      role,
      ngoId: role === 'ngo' ? ngoId : undefined,
      name
    });
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// Report actions
export async function createAdminUser() {
  try {
    await connectDB();

    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      return { success: false, message: 'Admin user already exists' };
    }

    await User.create({
      username: 'admin',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      name: 'System Administrator'
    });

    return { success: true, message: 'Admin user created successfully' };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, message: error.message };
  }
}

export async function getReports(month = '', ngoId = '') {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Not authenticated' };
    }
    
    await connectDB();
    
    const filter = {};
    if (month) filter.month = month;
    if (ngoId) filter.ngoId = ngoId;
    
    // For NGO users, restrict to their own reports
    const currentUser = await getCurrentUser();
    if (currentUser.role === 'ngo') {
      filter.ngoId = currentUser.ngoId;
    }
    
    const reports = await Report.find(filter).sort({ month: -1 });
    
    return {
      success: true,
      count: reports.length,
      reports: reports.map(report => ({
        _id: report._id.toString(),
        ngoId: report.ngoId,
        month: report.month,
        peopleHelped: report.peopleHelped,
        eventsConducted: report.eventsConducted,
        fundsUtilized: report.fundsUtilized,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString()
      }))
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function getReportById(id) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Not authenticated' };
    }
    
    await connectDB();
    
    const report = await Report.findById(id);
    
    if (!report) {
      return { success: false, message: 'Report not found' };
    }
    
    // Check permissions
    const currentUser = await getCurrentUser();
    if (currentUser.role === 'ngo' && report.ngoId !== currentUser.ngoId) {
      return { success: false, message: 'Not authorized to access this report' };
    }
    
    return {
      success: true,
      report: {
        _id: report._id.toString(),
        ngoId: report.ngoId,
        month: report.month,
        peopleHelped: report.peopleHelped,
        eventsConducted: report.eventsConducted,
        fundsUtilized: report.fundsUtilized,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString()
      }
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function submitReport(formData) {
  const session = await getSession();
  console.log('Session in submitReport:', session); // Debugging log
  if (!session) {
    console.log('No session found in submitReport'); // Debugging log
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await connectDB();
    
    const user = await getCurrentUser();
    console.log('User in submitReport:', user); // Debugging log
    
    const ngoId = formData.get('ngoId');
    const month = formData.get('month');
    const peopleHelped = parseInt(formData.get('peopleHelped'));
    const eventsConducted = parseInt(formData.get('eventsConducted'));
    const fundsUtilized = parseFloat(formData.get('fundsUtilized'));
    console.log('Form data in submitReport:', { ngoId, month, peopleHelped, eventsConducted, fundsUtilized }); // Debugging log
    
    if (user.role === 'ngo' && user.ngoId !== ngoId) {
      console.log('Permission denied in submitReport:', { userRole: user.role, userNgoId: user.ngoId, formNgoId: ngoId }); // Debugging log
      return { success: false, message: 'You can only submit reports for your own NGO' };
    }
    
    const existingReport = await Report.findOne({ ngoId, month });
    console.log('Existing report in submitReport:', existingReport); // Debugging log
    if (existingReport) {
      return { success: false, message: 'A report for this month already exists' };
    }
    
    const report = await Report.create({
      ngoId,
      month,
      peopleHelped,
      eventsConducted,
      fundsUtilized
    });
    console.log('Report created in submitReport:', report); // Debugging log
    
    revalidatePath('/reports');
    return { 
      success: true,
      report: {
        _id: report._id.toString(),
        ngoId: report.ngoId,
        month: report.month,
        peopleHelped: report.peopleHelped,
        eventsConducted: report.eventsConducted,
        fundsUtilized: report.fundsUtilized
      }
    };
  } catch (error) {
    console.error('Error in submitReport:', error); // Debugging log
    return { success: false, message: error.message };
  }
}

export async function updateReport(id, formData) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await connectDB();
    
    const report = await Report.findById(id);
    if (!report) {
      return { success: false, message: 'Report not found' };
    }
    
    const user = await getCurrentUser();
    
    if (user.role === 'ngo' && user.ngoId !== report.ngoId) {
      return { success: false, message: 'You can only update your own NGO reports' };
    }
    
    const peopleHelped = parseInt(formData.get('peopleHelped'));
    const eventsConducted = parseInt(formData.get('eventsConducted'));
    const fundsUtilized = parseFloat(formData.get('fundsUtilized'));
    
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        peopleHelped,
        eventsConducted,
        fundsUtilized
      },
      { new: true, runValidators: true }
    );
    
    revalidatePath('/reports');
    return { 
      success: true,
      report: {
        _id: updatedReport._id.toString(),
        ngoId: updatedReport.ngoId,
        month: updatedReport.month,
        peopleHelped: updatedReport.peopleHelped,
        eventsConducted: updatedReport.eventsConducted,
        fundsUtilized: updatedReport.fundsUtilized
      }
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function deleteReport(id) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    await connectDB();
    
    const user = await getCurrentUser();
    
    if (user.role !== 'admin') {
      return { success: false, message: 'Only admin can delete reports' };
    }
    
    const report = await Report.findById(id);
    if (!report) {
      return { success: false, message: 'Report not found' };
    }
    
    await report.deleteOne();
    
    revalidatePath('/reports');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function getDashboardData(month = '') {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Not authenticated' };
    }
    
    await connectDB();
    
    const currentUser = await getCurrentUser();
    if (currentUser.role !== 'admin') {
      return { success: false, message: 'Not authorized as admin' };
    }
    
    // Validate month format if provided
    if (month) {
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(month)) {
        return {
          success: false,
          message: 'Month must be in YYYY-MM format'
        };
      }
    }
    
    const filter = month ? { month } : {};
    
    const aggregationResult = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$month',
          totalNGOs: { $addToSet: '$ngoId' },
          totalPeopleHelped: { $sum: '$peopleHelped' },
          totalEventsConducted: { $sum: '$eventsConducted' },
          totalFundsUtilized: { $sum: '$fundsUtilized' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          totalNGOs: { $size: '$totalNGOs' },
          totalPeopleHelped: 1,
          totalEventsConducted: 1,
          totalFundsUtilized: 1
        }
      },
      { $sort: { month: -1 } }
    ]);
    
    // If no data found for the month
    if (month && aggregationResult.length === 0) {
      return {
        success: true,
        data: {
          month,
          totalNGOs: 0,
          totalPeopleHelped: 0,
          totalEventsConducted: 0,
          totalFundsUtilized: 0
        }
      };
    }
    
    return {
      success: true,
      data: month ? aggregationResult[0] : aggregationResult
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}