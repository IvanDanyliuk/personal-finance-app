'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, SlidersHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Chip } from '@/components/common';


export const IncomeFilters: React.FC = () => {
  const t = useTranslations();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [isDateFiltersOpen, setDateFiltersOpen] = useState<boolean>(false);
  const [isRestFiltersOpen, setRestFiltersOpen] = useState<boolean>(false);
  const filtersData = useState<any>({})

  useEffect(() => {

  }, []);

  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <Dialog open={isDateFiltersOpen} onOpenChange={setDateFiltersOpen}>
          <DialogTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
            <CalendarDays className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose period</DialogTitle>
            </DialogHeader>
            Date From - Date To
          </DialogContent>
        </Dialog>
        <div className='px-4 w-fit h-10 flex justify-center items-center border border-background-neutral  rounded-full'>
          01.12.2024 - 17.01.2024
        </div>
        <Dialog open={isRestFiltersOpen} onOpenChange={setRestFiltersOpen}>
          <DialogTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
            <SlidersHorizontal className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            Amount From - Amount To
            Source
          </DialogContent>
        </Dialog>
      </div>
      <Separator orientation='vertical' className='h-10 bg-background-neutral' />
      <div className='flex items-center gap-2'>
        <Chip title='Salary' />
        <Chip title='Investment' />
        <Chip title='Rent' />
      </div>
    </div>
  );
};