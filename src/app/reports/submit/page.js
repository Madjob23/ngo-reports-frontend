// src/app/reports/submit/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/store/authStore';
import apiService from '@/services/apiService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SubmitReport() {
  const { user, isNGO, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ngoId: user?.ngoId || '',
      month: new Date().toISOString().slice(0, 7), // Default to current month (YYYY-MM)
      peopleHelped: '',
      eventsConducted: '',
      fundsUtilized: '',
    },
  });

  if (!isAuthenticated() || (!isNGO() && user?.role !== 'admin')) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Convert string values to numbers
      const reportData = {
        ...data,
        peopleHelped: Number(data.peopleHelped),
        eventsConducted: Number(data.eventsConducted),
        fundsUtilized: Number(data.fundsUtilized),
      };
      
      await apiService.createReport(reportData);
      
      toast.success('Report submitted', {
        description: 'Your monthly report has been submitted successfully.',
      });
      
      router.push('/reports');
    } catch (error) {
      toast.error('Submission failed', {
        description: error.message || 'An error occurred while submitting the report.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit Monthly Report</CardTitle>
          <CardDescription>
            Report your NGO&apos;s impact metrics for the month
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ngoId">NGO ID</Label>
              <Input
                id="ngoId"
                {...register('ngoId', { required: 'NGO ID is required' })}
                disabled={isNGO()} // NGO users can't change their ID
              />
              {errors.ngoId && (
                <p className="text-sm text-red-500">{errors.ngoId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                {...register('month', { required: 'Month is required' })}
              />
              {errors.month && (
                <p className="text-sm text-red-500">{errors.month.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peopleHelped">People Helped</Label>
              <Input
                id="peopleHelped"
                type="number"
                min="0"
                {...register('peopleHelped', { 
                  required: 'This field is required',
                  min: { value: 0, message: 'Value must be 0 or greater' },
                  valueAsNumber: true
                })}
              />
              {errors.peopleHelped && (
                <p className="text-sm text-red-500">{errors.peopleHelped.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventsConducted">Events Conducted</Label>
              <Input
                id="eventsConducted"
                type="number"
                min="0"
                {...register('eventsConducted', { 
                  required: 'This field is required',
                  min: { value: 0, message: 'Value must be 0 or greater' },
                  valueAsNumber: true
                })}
              />
              {errors.eventsConducted && (
                <p className="text-sm text-red-500">{errors.eventsConducted.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundsUtilized">Funds Utilized</Label>
              <Input
                id="fundsUtilized"
                type="number"
                min="0"
                step="0.01"
                {...register('fundsUtilized', { 
                  required: 'This field is required',
                  min: { value: 0, message: 'Value must be 0 or greater' },
                  valueAsNumber: true
                })}
              />
              {errors.fundsUtilized && (
                <p className="text-sm text-red-500">{errors.fundsUtilized.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}