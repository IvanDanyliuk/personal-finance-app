'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExpensesGeneralFiltersSchema, expensesGeneralFiltersSchema } from '@/lib/types/form-schemas/expenses';
import { cn } from '@/lib/utils';
import { CURRENCIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';


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
    resolver: zodResolver(expensesGeneralFiltersSchema),
    defaultValues: {
      amountFrom: undefined,
      amountTo: undefined,
      category: params.get('category') ? params.get('category')?.split(';') : [],
      currency: params.get('currency') ? params.get('currency')?.split(';') : [],
      paymentMethod: params.get('paymentMethod') ? params.get('paymentMethod')?.split(';') : [],
    }
  });

  const watchedValues = watch();

  const onFiltersSubmit: SubmitHandler<ExpensesGeneralFiltersSchema> = (data) => {
    if(data.amountFrom === 0) params.delete('amountFrom');
    if(data.amountTo === 0) params.delete('amountTo');
    if(data.amountFrom && data.amountFrom > 0) params.set('amountFrom', data.amountFrom.toString());
    if(data.amountTo && data.amountTo > 0) params.set('amountTo', data.amountTo.toString());  
    replace(`${pathname}?${params.toString()}`);
  };

  const onClearGeneralFilters = () => {
    const amountFrom = params.get('amountFrom');
    const amountTo = params.get('amountTo');
    const category = params.get('category');
    const currency = params.get('currency');
    const paymentMethod = params.get('paymentMethod');

    if(amountFrom) params.delete('amountFrom');
    if(amountTo) params.delete('amountTo');
    if(category) params.delete('category');
    if(currency) params.delete('currency');
    if(paymentMethod) params.delete('paymentMethod');

    replace(`${pathname}?${params.toString()}`);
    setRestFiltersOpen(false);
  };

  return (
    <Dialog open={isRestFiltersOpen} onOpenChange={setRestFiltersOpen}>
      <DialogTrigger>
        <TooltipProvider key={crypto.randomUUID()}>
          <Tooltip>
            <TooltipTrigger className='w-12 h-12 flex justify-center items-center bg-primary-7 text-white border-none rounded-full'>
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
      <DialogContent className='min-w-fit md:min-w-[32rem] max-w-[calc(100%-3rem)] md:max-w-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl'>
        <DialogHeader>
          <DialogTitle>
            {t('ExpensesPage.filters.general.title')}
          </DialogTitle>
        </DialogHeader>
        <form className='space-y-3'>
          <Controller 
            name='amountFrom'
            control={control}
            render={({ field }) => (
              <Input 
                placeholder={t('ExpensesPage.filters.general.amountFrom')}
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
                placeholder={t('ExpensesPage.filters.general.amountTo')}
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
            name='category'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Accordion type='single' collapsible>
                <AccordionItem value='expense_categories' className='w-full border-none'>
                  <AccordionTrigger className='px-5 border broder-secondary-3 rounded-full'>
                    {t('ExpensesPage.filters.general.selectCategoryTriggerBtn')}
                  </AccordionTrigger>
                  <AccordionContent className='px-5 py-3'>
                    <ul className='space-y-4'>
                      {EXPENSE_CATEGORIES.map(option => (
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
                                  params.delete('category');
                                } else {
                                  params.set('category', newValue?.join(';'));
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
                    {t('ExpensesPage.filters.general.selectCurrencyTriggerBtn')}
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
          <Controller 
            name='paymentMethod'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Accordion type='single' collapsible>
                <AccordionItem value='payment_methods' className='w-full border-none'>
                  <AccordionTrigger className='px-5 border broder-secondary-3 rounded-full'>
                    {t('ExpensesPage.filters.general.selectPaymentMethodTriggerBtn')}
                  </AccordionTrigger>
                  <AccordionContent className='px-5 py-3'>
                    <ul className='space-y-4'>
                      {PAYMENT_METHODS.map(currency => (
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
                                  params.delete('paymentMethod');
                                } else {
                                  params.set('paymentMethod', newValue?.join(';'));
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
              {t('ExpensesPage.filters.general.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};