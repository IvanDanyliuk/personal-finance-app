'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/helpers';


interface ISavingsData {
  years: number[];
  data: {
    month: number;
    data: {
      currency: string;
      totalIncomes: number;
      totalExpenses: number;
    }[];
  }[];
};


export const SavingsData: React.FC<ISavingsData> = ({ years, data }) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [currentYear, setCurrentYear] = useState<number>(years[0]);

  const handleSetYear = (yearValue: number) => {
    params.set('year', yearValue.toString());
    replace(`${pathname}?${params.toString()}`);
    setCurrentYear(yearValue);
  };

  return (
    <div className='relative w-full min-h-full h-full flex gap-3'>
      <ul className='w-auto space-y-1'>
        {years.map((year) => (
          <li key={crypto.randomUUID()}>
            <Button 
              onClick={() => handleSetYear(year)}
              className={cn(
                currentYear === year 
                  ? 'bg-primary-7 text-white' 
                  : 'bg-background-secondary text-foreground', 
                'w-32 border border-primary-7 rounded-full'
              )}
            >
              {year}
            </Button>
          </li>
        ))}
      </ul>
      <Separator orientation='vertical' className='bg-secondary-1' />
      <div className='flex-1'>
        <Table className='border-separate border-spacing-y-3'>
          <TableHeader>
            <TableRow className='border-none bg-background-normal'>
              <TableHead className='px-6 py-3 rounded-l-full font-semibold'>
                {t('AnalyticsPage.savingsData.monthTableCol')}
              </TableHead>
              <TableHead className='px-6 py-3 font-semibold'>
                {t('AnalyticsPage.savingsData.currencyTableCol')}
              </TableHead>
              <TableHead className='px-6 py-3 font-semibold'>
                {t('AnalyticsPage.savingsData.totalIncomeTableCol')}
              </TableHead>
              <TableHead className='px-6 py-3 font-semibold'>
                {t('AnalyticsPage.savingsData.totalExpenseTableCol')}
              </TableHead>
              <TableHead className='px-6 py-3 font-semibold'>
                {t('AnalyticsPage.savingsData.savingsTableCol')}
              </TableHead>
              <TableHead className='px-6 py-3 rounded-r-full font-semibold'>
                {t('AnalyticsPage.savingsData.limitCovarageTableCol')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow 
                key={crypto.randomUUID()} 
                className='text-foreground bg-background hover:bg-background-neutral'
              >
                <TableCell className='px-6 font-medium border border-r-0 border-secondary-1 rounded-l-3xl'>
                  {t(`General.months.${item.month - 1}`)}
                </TableCell>
                <TableCell className='px-6 border-t border-b border-secondary-1 space-y-1'>
                  {item.data.map(dataItem => (
                    <div key={crypto.randomUUID()}>
                      {t(`General.currencies.${dataItem.currency}`)}
                    </div>
                  ))}
                </TableCell>
                <TableCell className='px-6 border-t border-b border-secondary-1 space-y-1'>
                  {item.data.map(dataItem => (
                    <div key={crypto.randomUUID()}>
                      {formatNumber(dataItem.totalIncomes, 3)}
                    </div>
                  ))}
                </TableCell>
                <TableCell className='px-6 border-t border-b border-secondary-1 space-y-1'>
                  {item.data.map(dataItem => (
                    <div key={crypto.randomUUID()}>
                      {formatNumber(dataItem.totalExpenses, 3)}
                    </div>
                  ))}
                </TableCell>
                <TableCell className='px-6 border-t border-b border-secondary-1 space-y-1'>
                  {item.data.map(dataItem => {
                    const difference = dataItem.totalIncomes - dataItem.totalExpenses;
                    return (
                      <div 
                        key={crypto.randomUUID()} 
                        className={cn(
                          difference < 0 
                            ? 'text-danger-2' 
                            : 'text-success-2', 
                          'font-semibold'
                        )}
                      >
                        {difference > 0 
                          ? `+${formatNumber(difference, 3)}` 
                          : formatNumber(difference, 3)
                        }
                      </div>
                    )
                  })}
                </TableCell>
                <TableCell className={cn(
                  i < data.length - 1 
                    ? 'border-b border-b-secondary-1' 
                    : '', 
                  'px-6 min-w-32 border border-l-0 border-secondary-1 space-y-1 rounded-r-3xl'
                )}>
                  {item.data.map(dataItem => {
                    const budget = Math.ceil((dataItem.totalExpenses / dataItem.totalIncomes) * 100);
                    return (
                      <Progress key={crypto.randomUUID()} value={budget} />
                    )
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};