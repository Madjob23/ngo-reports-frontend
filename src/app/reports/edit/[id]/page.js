// src/app/reports/edit/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import apiService from '@/services/apiService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {toast} from 'sonner';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function EditReport({ params }) {
  const { id } = params;
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the report data
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['report', id],
    queryFn: () => apiService.getReportById(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Set form values when data is loaded
  useEffect(() => {
    if (data?.report) {
      reset({
        ngoId: data.report.ngoId,
        month: data.report.month,
        peopleHelped: data.report.peopleHelped,
        eventsConducted: data.report.eventsConducted,
        fundsUtilized: data.report.fundsUtilized,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return null; // Will be redirected to login
  }

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Convert string values to numbers
      const reportData = {
        peopleHelped: Number(formData.peopleHelped),
        eventsConducted: Number(formData.eventsConducted),
        fundsUtilized: Number(formData.fundsUtilized),
      };
      
      await apiService.updateReport(id, reportData);
      
      toast.success('Report updated', {
        description: 'The report has been updated successfully.',
      });
      
      router.push('/reports');
    } catch (error) {
      toast.error('Update failed', {
        description: error.message || 'An error occurred while updating the report.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading report data..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error.message || 'Failed to load report'} 
        onRetry={refetch} 
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Report</CardTitle>
          <CardDescription>
            Update your impact metrics for {data?.report?.month}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ngoId">NGO ID</Label>
              <Input
                id="ngoId"
                {...register('ngoId')}
                disabled={true} // NGO ID cannot be changed
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                {...register('month')}
                disabled={true} // Month cannot be changed
              />
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
              {isSubmitting ? 'Updating...' : 'Update Report'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}