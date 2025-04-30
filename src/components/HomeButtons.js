'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HomeButtons({ route, label }) {
  const router = useRouter();
  
  return (
    <Button onClick={() => router.push(route)} className="w-full sm:w-auto">
      {label}
    </Button>
  );
}