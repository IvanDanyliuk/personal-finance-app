'use client';

import { useState } from 'react';
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
import { SubmitButton } from '@/components/common';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incomesFilteringByDateSchema, incomesGeneralFiltersSchema, IncomesGeneralFiltersSchema } from '@/lib/types/form-schemas/incomes';
import { DatePicker, TextField } from '@/components/inputs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { INCOME_SOURCES } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DateFilters } from './date-filters';


export const IncomeFilters: React.FC = () => {
  const t = useTranslations();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [isRestFiltersOpen, setRestFiltersOpen] = useState<boolean>(false);
  

  const {
    control: controlGeneralFiltersForm,
    handleSubmit: handleSubmitGeneralFiltersForm,
    formState: { errors: generalFiltersErrors },
  } = useForm({
    resolver: zodResolver(incomesGeneralFiltersSchema),
    defaultValues: {
      amountFrom: 0,
      amountTo: 0,
      source: params.get('source') ? params.get('source')?.split(';') : []
    }
  });

  const onGeneralFiltersSubmit: SubmitHandler<IncomesGeneralFiltersSchema> = (data) => {
    if(data.amountFrom && data.amountFrom > 0) params.set('amountFrom', data.amountFrom.toString());
    if(data.amountTo && data.amountTo > 0) params.set('amountTo', data.amountTo.toString());
    if(data.source && data.source.length > 0) {
      params.set('source', data.source.join(';'));
    } else {
      params.delete('source');
    };
    replace(`${pathname}?${params.toString()}`);
    setRestFiltersOpen(false);
  };

  const onClearGeneralFilters = () => {
    const amountFrom = params.get('amountFrom');
    const amountTo = params.get('amountTo');
    const source = params.get('source');

    if(amountFrom) params.delete('amountFrom');
    if(amountTo) params.delete('amountTo');
    if(source) params.delete('source');

    replace(`${pathname}?${params.toString()}`);
    setRestFiltersOpen(false);
  };

  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <DateFilters />
        <Dialog open={isRestFiltersOpen} onOpenChange={setRestFiltersOpen}>
          <DialogTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
            <SlidersHorizontal className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent className='min-h-fit'>
            <DialogHeader>
              <DialogTitle>
                {t('IncomesPage.filters.general.title')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitGeneralFiltersForm(onGeneralFiltersSubmit )} className='space-y-3'>
              <Controller 
                name='amountFrom'
                control={controlGeneralFiltersForm}
                render={({ field }) => (
                  <TextField 
                    name='amountFrom'
                    label={t('IncomesPage.filters.general.amountFrom')}
                    type='number'
                    field={field}
                  />
                )}
              />
              <Controller 
                name='amountTo'
                control={controlGeneralFiltersForm}
                render={({ field }) => (
                  <TextField 
                    name='amountTo'
                    label={t('IncomesPage.filters.general.amountTo')}
                    type='number'
                    field={field}
                  />
                )}
              />
              <Controller 
                name='source'
                control={controlGeneralFiltersForm}
                render={({ field: { value, onChange } }) => (
                  <Accordion type='single' collapsible>
                    <AccordionItem value='income_sources' className='w-full border-none'>
                      <AccordionTrigger className='px-5 border broder-secondary-3 rounded-full'>
                        {t('IncomesPage.filters.general.selectSourceTriggerBtn')}
                      </AccordionTrigger>
                      <AccordionContent className='px-5 py-3'>
                        <ul className='space-y-4'>
                          {INCOME_SOURCES.map(option => (
                            <li key={crypto.randomUUID()} className='flex items-center gap-2'>
                              <Checkbox
                                id={option.value}
                                checked={value?.includes(option.value)}
                                onCheckedChange={(isChecked: boolean) => {
                                  const newValue = isChecked
                                    ? [...(value || []), option.value]
                                    : value?.filter((v) => v !== option.value);
                                  onChange(newValue);
                                  if(newValue) {
                                    params.set('source', newValue?.join(';'))
                                    replace(`${pathname}?${params.toString()}`);
                                  }
                                }}
                                className='w-5 h-5 bg-primary-6 text-white'
                              />
                              <Label
                                htmlFor={option.value}
                                className={cn("text-sm font-medium text-gray-900")}
                              >
                                {t(option.label)}
                              </Label>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>  
                )}
              />
              <div className='w-full flex gap-3'>
                {/* <SubmitButton className='flex-1'>
                  {t('IncomesPage.filters.general.submitBtnLabel')}
                </SubmitButton> */}
                <Button 
                  type='button' 
                  onClick={onClearGeneralFilters}
                  className='mt-3 py-6 flex-1 bg-secondary-5 hover:bg-secondary-4 rounded-full text-white font-semibold'
                >
                  {t('IncomesPage.filters.general.cancelBtnLabel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};