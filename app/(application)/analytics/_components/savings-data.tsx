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
import { cn } from '@/lib/utils';


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
    <div className='w-full flex gap-3'>
      <ul className='space-y-1'>
        {years.map((year) => (
          <li key={crypto.randomUUID()}>
            <Button 
              onClick={() => handleSetYear(year)}
              className={cn(
                currentYear === year ? 'bg-primary-7 text-white' : 'bg-primary-1 text-secondary-5', 
                'w-32 border border-primary-7 rounded-full'
              )}
            >
              {year}
            </Button>
          </li>
        ))}
      </ul>
      <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Incomes</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Savings</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={crypto.randomUUID()}>
              <TableCell className="font-medium">
                {t(`General.months.${item.month - 1}`)}
              </TableCell>
              <TableCell rowSpan={item.data.length}>
                {item.data.map(dataItem => (
                  <div key={crypto.randomUUID()}>
                    {dataItem.currency}
                  </div>
                ))}
              </TableCell>
              <TableCell rowSpan={item.data.length}>
                {item.data.map(dataItem => (
                  <div key={crypto.randomUUID()}>
                    {dataItem.totalIncomes}
                  </div>
                ))}
              </TableCell>
              <TableCell rowSpan={item.data.length}>
                {item.data.map(dataItem => (
                  <div key={crypto.randomUUID()}>
                    {dataItem.totalExpenses}
                  </div>
                ))}
              </TableCell>
              <TableCell rowSpan={item.data.length}>

              </TableCell>
              <TableCell rowSpan={item.data.length}>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      </div>
    </div>
  );
};