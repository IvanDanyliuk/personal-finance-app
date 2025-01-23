'use client'

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DateFilters } from '@/components/data-rendering';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCIES } from '@/lib/constants';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis } from 'recharts';


interface IChartBoard {
  data: {
    month: number;
    data: {
      totalIncomes: number;
      totalExpenses: number;
      currency: string;
    }[];
  }[];
  currentCurrency: string;
};

type CashFlow = {
  month: string; 
  income: number; 
  expenses: number;
};

type FundsData = {
  month: string;
  value: number;
};


export const ChartBoard: React.FC<IChartBoard> = ({ data, currentCurrency }) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [income, setIncome] = useState<FundsData[]>([]);
  const [expenses, setExpenses] = useState<FundsData[]>([]);

  const cashFlowChartConfig = {
    income: {
      label: t('AnalyticsPage.charts.cashFlow.income'),
      color: 'bg-primary-7'
    },
    expenses: {
      label: t('AnalyticsPage.charts.cashFlow.expenses'),
      color: 'bg-primary-5'
    },
  } satisfies ChartConfig;

  const handelSelectCurrency = (value: string) => {
    setSelectedCurrency(value);
    params.set('currency', value);
    replace(`${pathname}?${params.toString()}`);
  };

  useMemo(() => {
    const cashFlowData = data.map(dataItem => ({ 
      month: t(`General.months.${dataItem.month}`), 
      income: dataItem.data[0].totalIncomes, 
      expenses: dataItem.data[0].totalExpenses,
    }));
    setCashFlow(cashFlowData);

    const incomeData = data.map(dataItem => ({
      month: t(`General.months.${dataItem.month}`),
      value: dataItem.data[0].totalIncomes,
    }));
    setIncome(incomeData);

    const expensesData = data.map(dataItem => ({
      month: t(`General.months.${dataItem.month}`),
      value: dataItem.data[0].totalExpenses,
    }));
    setExpenses(expensesData);
  }, [data]);

  useEffect(() => {
    const currencyFromSearchParams = params.get('currency');
    setSelectedCurrency(currencyFromSearchParams || currentCurrency);
  }, [currentCurrency]);

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <DateFilters />
        <Select value={selectedCurrency} onValueChange={handelSelectCurrency}>
          <SelectTrigger className='w-[180px] h-10 px-5 rounded-full'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent className='bg-background'>
            {CURRENCIES.map(currency => (
              <SelectItem 
                key={crypto.randomUUID()} 
                value={currency.value}
              >
                {t(currency.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <ChartContainer config={cashFlowChartConfig} className='h-80 w-full'>
          <BarChart accessibilityLayer data={cashFlow}>
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <Bar dataKey='income' fill='hsl(var(--primary-7))' radius={4} />
            <Bar dataKey='expenses' fill='hsl(var(--primary-4))' radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div>
        <ChartContainer config={cashFlowChartConfig} className='h-80 w-full'>
          
        </ChartContainer>
      </div>
      <div>
        Expenses dynamic
      </div>
      <div>
        Income structure
      </div>
      <div>
        Expenses structure
      </div>
    </div>
  );
};