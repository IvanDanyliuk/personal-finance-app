'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IncomesGeneralFiltersSchema, incomesGeneralFiltersSchema } from '@/lib/types/form-schemas/incomes';
import { cn } from '@/lib/utils';
import { CURRENCIES, INCOME_SOURCES } from '@/lib/constants';


export const MainFilters: React.FC = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [isRestFiltersOpen, setRestFiltersOpen] = useState<boolean>(false);
  
  const {
    control,
    watch
  } = useForm({
    resolver: zodResolver(incomesGeneralFiltersSchema),
    defaultValues: {
      amountFrom: undefined,
      amountTo: undefined,
      source: params.get('source') ? params.get('source')?.split(';') : [],
      currency: params.get('currency') ? params.get('currency')?.split(';') : [],
    }
  });

  const watchedValues = watch();

  const onFiltersSubmit: SubmitHandler<IncomesGeneralFiltersSchema> = (data) => {
    if(data.amountFrom === 0) params.delete('amountFrom');
    if(data.amountTo === 0) params.delete('amountTo');
    if(data.amountFrom && data.amountFrom > 0) params.set('amountFrom', data.amountFrom.toString());
    if(data.amountTo && data.amountTo > 0) params.set('amountTo', data.amountTo.toString());  
    replace(`${pathname}?${params.toString()}`);
  };

  const onClearGeneralFilters = () => {
    const amountFrom = params.get('amountFrom');
    const amountTo = params.get('amountTo');
    const source = params.get('source');
    const currency = params.get('currency');

    if(amountFrom) params.delete('amountFrom');
    if(amountTo) params.delete('amountTo');
    if(source) params.delete('source');
    if(currency) params.delete('currency');

    replace(`${pathname}?${params.toString()}`);
    setRestFiltersOpen(false);
  };

  return (
    <Dialog open={isRestFiltersOpen} onOpenChange={setRestFiltersOpen}>
      <DialogTrigger>
        <TooltipProvider key={crypto.randomUUID()}>
          <Tooltip>
            <TooltipTrigger className='w-10 h-10 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
              <SlidersHorizontal className='w-5 h-5' />
            </TooltipTrigger>
            <TooltipContent className='px-3 py-1 max-w-44 text-center bg-primary-2 text-secondary-8 rounded-xl'>
              <p>
                {t('ExpensesPage.filters.general.title')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className='min-h-fit'>
        <DialogHeader>
          <DialogTitle>
            {t('IncomesPage.filters.general.title')}
          </DialogTitle>
        </DialogHeader>
        <form className='space-y-3'>
          <Controller 
            name='amountFrom'
            control={control}
            render={({ field }) => (
              <Input 
                placeholder={t('IncomesPage.filters.general.amountFrom')}
                value={field.value}
                type='number'
                onChange={(e) => {
                  const newValue = e.target.value;
                  field.onChange(newValue);
                  onFiltersSubmit({ ...watchedValues, amountFrom: +newValue });
                }}
                className='w-full px-5 py-6 rounded-full'
              />
            )}
          />
          <Controller 
            name='amountTo'
            control={control}
            render={({ field }) => (
              <Input 
                placeholder={t('IncomesPage.filters.general.amountTo')}
                value={field.value}
                type='number'
                onChange={(e) => {
                  const newValue = e.target.value;
                  field.onChange(newValue);
                  onFiltersSubmit({ ...watchedValues, amountTo: +newValue });
                }}
                className='w-full px-5 py-6 rounded-full'
              />
            )}
          />
          <Controller 
            name='source'
            control={control}
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
                                if(newValue.length === 0) {
                                  params.delete('source');
                                } else {
                                  params.set('source', newValue?.join(';'));
                                }
                                replace(`${pathname}?${params.toString()}`);
                              }
                            }}
                            className='w-5 h-5 bg-primary-6 text-white'
                          />
                          <Label
                            htmlFor={option.value}
                            className={cn('text-sm font-medium text-gray-900')}
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
          <Controller 
            name='currency'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Accordion type='single' collapsible>
                <AccordionItem value='income_sources' className='w-full border-none'>
                  <AccordionTrigger className='px-5 border broder-secondary-3 rounded-full'>
                    {t('IncomesPage.filters.general.selectCurrencyTriggerBtn')}
                  </AccordionTrigger>
                  <AccordionContent className='px-5 py-3'>
                    <ul className='space-y-4'>
                      {CURRENCIES.map(currency => (
                        <li key={crypto.randomUUID()} className='flex items-center gap-2'>
                          <Checkbox
                            id={currency.value}
                            checked={value?.includes(currency.value)}
                            onCheckedChange={(isChecked: boolean) => {
                              const newValue = isChecked
                                ? [...(value || []), currency.value]
                                : value?.filter((v) => v !== currency.value);
                              onChange(newValue);
                              if(newValue) {
                                if(newValue.length === 0) {
                                  params.delete('currency');
                                } else {
                                  params.set('currency', newValue?.join(';'));
                                }
                                replace(`${pathname}?${params.toString()}`);
                              }
                            }}
                            className='w-5 h-5 bg-primary-6 text-white'
                          />
                          <Label
                            htmlFor={currency.value}
                            className={cn('text-sm font-medium text-gray-900')}
                          >
                            {t(currency.label)}
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
  );
};