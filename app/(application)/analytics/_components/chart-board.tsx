'use client'

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { DateFilters } from '@/components/data-rendering';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from '@/components/ui/chart';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import { NoChartDataPlaceholder } from './no-chart-data-placeholder';
import NoCashFlowData from '@/public/images/business-vision.svg';
import { CashFlow, ExpensesStructure, FundsData, IncomeStructure } from '@/lib/types/analytics.types';


interface IChartBoard {
  data: {
    dynamic: {
      month: number;
      data: {
        totalIncomes: number;
        totalExpenses: number;
        currency: string;
      }[];
    }[];
    structure: {
      incomes: {
        source: string;
        amount: number;
      }[];
      expenses: {
        category: string;
        amount: number;
      }[];
    };
  };
  currentCurrency: string;
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
  const [incomeStructure, setIncomeStructure] = useState<IncomeStructure[]>([]);
  const [expensesStructure, setExpensesStructure] = useState<ExpensesStructure[]>([]);

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

  const incomeLineChartConfig = {
    value: {
      label: t('AnalyticsPage.charts.income'),
      color: 'bg-primary-7'
    }
  } satisfies ChartConfig;
  
  const expensesLineChartConfig = {
    value: {
      label: t('AnalyticsPage.charts.expenses'),
      color: 'bg-primary-7'
    }
  } satisfies ChartConfig;

  const incomeStructureConfig = {
    source: {
      label: t('AnalyticsPage.charts.fundsStructure.income'),
      color: 'bg-primary-7'
    }
  };

  const expensesStructureConfig = {
    category: {
      label: t('AnalyticsPage.charts.fundsStructure.expenses'),
      color: 'bg-primary-5'
    }
  };

  const handelSelectCurrency = (value: string) => {
    setSelectedCurrency(value);
    params.set('currency', value);
    replace(`${pathname}?${params.toString()}`);
  };

  useMemo(() => {
    const cashFlowData = data.dynamic.map(dataItem => ({ 
      month: t(`General.months.${dataItem.month - 1}`), 
      income: dataItem.data[0].totalIncomes, 
      expenses: dataItem.data[0].totalExpenses,
    }));
    setCashFlow(cashFlowData);

    const incomeData = data.dynamic.map(dataItem => ({
      month: t(`General.months.${dataItem.month - 1}`),
      value: dataItem.data[0].totalIncomes,
    }));
    setIncome(incomeData);

    const expensesData = data.dynamic.map(dataItem => ({
      month: t(`General.months.${dataItem.month - 1}`),
      value: dataItem.data[0].totalExpenses,
    }));
    setExpenses(expensesData);

    const incomeStructureData = data.structure.incomes.map(dataItem => ({
      source: t(`IncomesPage.income_sources.${dataItem.source}`),
      amount: dataItem.amount,
      color: INCOME_SOURCES.find(item => item.value === dataItem.source)?.color || 'bg-primary-7'
    }));
    setIncomeStructure(incomeStructureData);

    const expensesStructureData = data.structure.expenses.map(dataItem => ({
      category: t(`ExpensesPage.expense_destinations.${dataItem.category}`),
      amount: dataItem.amount,
      color: EXPENSE_CATEGORIES.find(item => item.value === dataItem.category)?.color || 'bg-primary-7'
    }));
    setExpensesStructure(expensesStructureData);
  }, [data]);

  useEffect(() => {
    const currencyFromSearchParams = params.get('currency');
    setSelectedCurrency(currencyFromSearchParams || currentCurrency);
  }, [currentCurrency]);

  return (
    <div className='space-y-10'>
      <div className='flex gap-2'>
        <DateFilters />
        <Select value={selectedCurrency} onValueChange={handelSelectCurrency}>
          <SelectTrigger className='w-[180px] h-12 px-5 rounded-full'>
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
      <div className='space-y-3 overflow-x-auto'>
        <h4 className='text-lg text-center font-semibold'>
          {t('AnalyticsPage.charts.cashFlow.title')}
        </h4>
        {cashFlow.length > 0 ? (
          <ChartContainer config={cashFlowChartConfig} className='h-96 min-w-full'>
            <BarChart accessibilityLayer data={cashFlow}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='income' fill='hsl(var(--primary-7))' radius={4} />
              <Bar dataKey='expenses' fill='hsl(var(--primary-4))' radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <NoChartDataPlaceholder 
            image={NoCashFlowData} 
            message={'AnalyticsPage.charts.noDataMessages.cashFlow'} 
          />
        )}
      </div>
      <div className='space-y-4 overflow-x-auto'>
        <h4 className='text-lg text-center font-semibold'>
          {t('AnalyticsPage.charts.income')}
        </h4>
        {income.length > 0 ? (
          <ChartContainer config={incomeLineChartConfig} className='h-96 min-w-full'>
            <BarChart accessibilityLayer data={income}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='value' fill='hsl(var(--primary-7))' radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <NoChartDataPlaceholder 
            image={NoCashFlowData} 
            message={'AnalyticsPage.charts.noDataMessages.income'} 
          />
        )}
      </div>
      <div className='space-y-4 overflow-x-auto'>
        <h4 className='text-lg text-center font-semibold'>
          {t('AnalyticsPage.charts.expenses')}
        </h4>
        {expenses.length > 0 ? (
          <ChartContainer config={expensesLineChartConfig} className='h-96 min-w-full'>
            <BarChart accessibilityLayer data={expenses}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='value' fill='hsl(var(--primary-7))' radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <NoChartDataPlaceholder 
            image={NoCashFlowData} 
            message={'AnalyticsPage.charts.noDataMessages.expenses'} 
          />
        )}
      </div>
      <div className='w-full flex flex-col md:flex-row gap-6'>
        <div className='flex-1 space-y-4'>
          <h4 className='text-lg text-center font-semibold'>
            {t('AnalyticsPage.charts.fundsStructure.income')}
          </h4>
          <ChartContainer config={incomeStructureConfig} className='w-full min-h-fit h-fit'>
            <PieChart className='w-52'>
              <Legend />
              <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
              <Pie 
                data={incomeStructure} 
                dataKey='amount' 
                nameKey='source' 
                cx='50%' 
                cy='50%' 
                innerRadius={'55%'} 
                outerRadius={'85%'} 
                label
              >
                {incomeStructure.map((entry, i) => (
                  <Cell key={`${entry}-${i}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className='flex-1 space-y-4'>
          <h4 className='text-lg text-center font-semibold'>
            {t('AnalyticsPage.charts.fundsStructure.expenses')}
          </h4>
          <ChartContainer config={expensesStructureConfig} className='w-full min-h-fit h-fit'>
            <PieChart className='w-52'>
              <Legend />
              <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
              <Pie 
                data={expensesStructure} 
                dataKey='amount' 
                nameKey='category' 
                cx='50%' 
                cy='50%' 
                innerRadius={'55%'} 
                outerRadius={'85%'} 
                label
              >
                {expensesStructure.map((entry, i) => (
                  <Cell key={`${entry}-${i}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};