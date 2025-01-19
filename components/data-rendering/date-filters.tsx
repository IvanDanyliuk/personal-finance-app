'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubmitButton } from '@/components/common';
import { Button } from '@/components/ui/button'; 
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { incomesFilteringByDateSchema } from '@/lib/types/form-schemas/incomes';
import { formatDateFilterValues } from '@/lib/helpers';


export const DateFilters: React.FC = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [isFiltersOpen, setFiltersOpen] = useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    setValue
  } = useForm({
    resolver: zodResolver(incomesFilteringByDateSchema),
    defaultValues: {
      dateFrom: params.get('dateFrom') ? new Date(params.get('dateFrom')!) : undefined,
      dateTo: params.get('dateTo') ? new Date(params.get('dateTo')!) : undefined,
    }
  });

  const onFiltersSubmit: SubmitHandler<FieldValues> = (data) => {
    if(data.dateFrom) params.set('dateFrom', data.dateFrom);
    if(data.dateTo) params.set('dateTo', data.dateTo);
    replace(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  const onClearFilters = () => {
    const dateFrom = params.get('dateFrom');
    const dateTo = params.get('dateTo');

    if(dateFrom) params.delete('dateFrom');
    if(dateTo) params.delete('dateTo');

    setValue('dateFrom', undefined);
    setValue('dateTo', undefined);

    replace(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  return (
    <>
      <Dialog 
        open={isFiltersOpen} 
        onOpenChange={setFiltersOpen}
      >
        <DialogTrigger>
          <TooltipProvider key={crypto.randomUUID()}>
            <Tooltip>
              <TooltipTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
                <CalendarDays className='w-5 h-5' />
              </TooltipTrigger>
              <TooltipContent className='px-3 py-1 max-w-44 text-center bg-primary-2 text-secondary-8 rounded-xl'>
                <p>
                  {t('IncomesPage.filters.date.title')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className='p-3'>
          <DialogHeader>
            <DialogTitle>
              {t('IncomesPage.filters.date.title')}
            </DialogTitle>
          </DialogHeader>
          <form 
            onSubmit={handleSubmit(onFiltersSubmit )}
            className='w-full space-y-3'
          >
            <div className='w-full flex flex-col md:flex-row gap-3'>
              <div className='flex-1 text-center'>
                <Controller 
                  name='dateFrom'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor='dateFrom' className='text-primary-9'>
                        {t('IncomesPage.filters.date.dateFromLabel')}
                        {field.value && `: ${format(field.value, 'dd.MM.yyyy')}`}
                      </Label>
                      <Calendar 
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className='mt-3 p-0'
                      />
                    </>
                  )}
                />
              </div>
              <div className='flex-1 text-center'>
                <Controller 
                  name='dateTo'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor='dateTo' className='text-primary-9'>
                        {t('IncomesPage.filters.date.dateToLabel')}
                        {field.value && `: ${format(field.value, 'dd.MM.yyyy')}`}
                      </Label>
                      <Calendar 
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className='mt-3 p-0'
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <div className='w-full flex gap-3'>
              <SubmitButton className='h-10 flex-1'>
                {t('IncomesPage.filters.date.submitBtnLabel')}
              </SubmitButton>
              <Button 
                type='button' 
                onClick={onClearFilters}
                className='mt-3 py-6 flex-1 bg-secondary-5 hover:bg-secondary-4 rounded-full text-white font-semibold'
              >
                {t('IncomesPage.filters.date.cancelBtnLabel')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className='px-4 w-fit h-10 flex justify-center items-center text-sm border border-background-neutral rounded-full'>
        {formatDateFilterValues({ 
          from: params.get('dateFrom'), 
          to: params.get('dateTo'), 
          noDataMessage: t('IncomesPage.filters.date.noFiltersMessage'),
          noDateFromMessage: t('IncomesPage.filters.date.noDateFromMessage'), 
          noDateToMessage: t('IncomesPage.filters.date.noDateToMessage')
        })}
      </div>
    </>
  );
};