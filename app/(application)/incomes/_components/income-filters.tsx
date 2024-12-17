'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Check, SlidersHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Chip, SubmitButton } from '@/components/common';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IncomesFilteringByDateSchema, incomesFilteringByDateSchema, incomesGeneralFiltersSchema, IncomesGeneralFiltersSchema } from '@/lib/types/form-schemas/incomes';
import { DatePicker, TextField } from '@/components/inputs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { INCOME_SOURCES } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export const IncomeFilters: React.FC = () => {
  const t = useTranslations();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [isDateFiltersOpen, setDateFiltersOpen] = useState<boolean>(false);
  const [isRestFiltersOpen, setRestFiltersOpen] = useState<boolean>(false);

  const [filteredSourceIndicators, setFilteredSourceIndicators] = useState<string[]>([]);

  const {
    control: controlDateFiltersForm,
    handleSubmit: handleSubmitDateFiltersForm,
    formState: { errors: dateFiltersErrors }
  } = useForm({
    resolver: zodResolver(incomesFilteringByDateSchema),
  });

  const {
    control: controlGeneralFiltersForm,
    handleSubmit: handleSubmitGeneralFiltersForm,
    formState: { errors: generalFiltersErrors }
  } = useForm({
    resolver: zodResolver(incomesGeneralFiltersSchema),
    defaultValues: {
      amountFrom: 0,
      amountTo: 0,
      source: filteredSourceIndicators
    }
  });

  const onDateFiltersSubmit: SubmitHandler<FieldValues> = (data) => {
    if(data.dateFrom) params.set('dateFrom', data.dateFrom);
    if(data.dateTo) params.set('dateTo', data.dateTo);
    replace(`${pathname}?${params.toString()}`);
    setDateFiltersOpen(false);
  };

  const onGeneralFiltersSubmit: SubmitHandler<IncomesGeneralFiltersSchema> = (data) => {
    if(data.amountFrom && data.amountFrom > 0) params.set('amountFrom', data.amountFrom.toString());
    if(data.amountTo && data.amountTo > 0) params.set('amountTo', data.amountTo.toString());
    if(data.source && data.source.length > 0) {
      const existingSourceParams = params.get('source');
      if(existingSourceParams) {
        params.set('source', `${existingSourceParams};${data.source.join(';')}`);
        
      } else {
        params.set('source', data.source.join(';'))
      }
    };
    replace(`${pathname}?${params.toString()}`);
    setRestFiltersOpen(false);
  };

  const onClearDateFilters = () => {
    const dateFrom = params.get('dateFrom');
    const dateTo = params.get('dateTo');

    if(dateFrom) params.delete('dateFrom');
    if(dateTo) params.delete('dateTo');

    replace(`${pathname}?${params.toString()}`);
    setDateFiltersOpen(false);
  };

  const onClearGeneralFilters = () => {
    const amountFrom = params.get('amountFrom');
    const amountTo = params.get('amountTo');
    const source = params.get('source');

    if(amountFrom) params.delete('amountFrom');
    if(amountTo) params.delete('amountTo');
    if(source) params.delete('source');

    replace(`${pathname}?${params.toString()}`);
    setFilteredSourceIndicators([]);
    setRestFiltersOpen(false);
  };

  const handleDeleteFilterItem = (value: string) => {
    const updatedFilteredSourceItems = filteredSourceIndicators.filter(item => item !== value);
    setFilteredSourceIndicators(updatedFilteredSourceItems);

    if(filteredSourceIndicators.length > 0) {
      params.set('source', updatedFilteredSourceItems.join(';'));
      replace(`${pathname}?${params.toString()}`);
    } else {
      params.delete('source');
      replace(`${pathname}?${params.toString()}`);
    }
  };

  useEffect(() => {
    const source = params.get('source');
    if(source && filteredSourceIndicators.length === 0) {
      setFilteredSourceIndicators(source.split(';'));
    }
  }, []);

  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <Dialog 
          open={isDateFiltersOpen} 
          onOpenChange={setDateFiltersOpen}
        >
          <DialogTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
            <CalendarDays className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent className='w-fit'>
            <DialogHeader>
              <DialogTitle>
                {t('IncomesPage.filters.date.title')}
              </DialogTitle>
            </DialogHeader>
            <form 
              onSubmit={handleSubmitDateFiltersForm(onDateFiltersSubmit )}
              className=''
            >
              <div className='flex flex-col md:flex-row items-end gap-3'>
                <div className='flex-1'>
                  <Label htmlFor='dateFrom'>
                    {t('IncomesPage.filters.date.dateFromLabel')}
                  </Label>
                  <Controller 
                    name='dateFrom'
                    control={controlDateFiltersForm}
                    render={({ field }) => (
                      <DatePicker 
                        id='dateFrom'
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    )}
                  />
                </div>
                <div className='flex-1'>
                  <Label htmlFor='dateTo'>
                    {t('IncomesPage.filters.date.dateToLabel')}
                  </Label>
                  <Controller 
                    name='dateTo'
                    control={controlDateFiltersForm}
                    render={({ field }) => (
                      <DatePicker 
                        id='dateTo'
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
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
                  onClick={onClearDateFilters}
                  className='mt-3 py-6 flex-1 bg-secondary-5 hover:bg-secondary-4 rounded-full text-white font-semibold'
                >
                  {t('IncomesPage.filters.date.cancelBtnLabel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div className='px-4 w-fit h-10 flex justify-center items-center border border-background-neutral  rounded-full'>
          01.12.2024 - 17.01.2024
        </div>
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
                            <li className='flex items-center gap-2'>
                              <Checkbox
                                id={option.value}
                                checked={value?.includes(option.value)}
                                onCheckedChange={(isChecked) => {
                                  const newValue = isChecked
                                    ? [...(value || []), option.value]
                                    : value?.filter((v) => v !== option.value);
                                  onChange(newValue);
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
                <SubmitButton className='flex-1'>
                  {t('IncomesPage.filters.general.submitBtnLabel')}
                </SubmitButton>
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
      <Separator orientation='vertical' className='h-10 bg-background-neutral' />
      <div className='flex items-center gap-2'>
        {filteredSourceIndicators.map(item => (
          <Chip 
            key={crypto.randomUUID()} 
            title={t(`IncomesPage.income_sources.${item}`)} 
            onClick={() => handleDeleteFilterItem(item)}
          />
        ))}
      </div>
    </div>
  );
};