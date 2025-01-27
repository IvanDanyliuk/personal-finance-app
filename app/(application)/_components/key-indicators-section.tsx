'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { NoChartDataPlaceholder } from '../analytics/_components';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import { CashFlow, ExpensesStructure, IncomeStructure } from '@/lib/types/analytics.types';
import NoCashFlowData from '@/public/images/business-vision.svg';


interface IKeyIndicatorsSection {
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
};


export const KeyIndicatorsSection: React.FC<IKeyIndicatorsSection> = ({ data }) => {
  const t = useTranslations();

  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
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

  useMemo(() => {
    const cashFlowData = data.dynamic.map(dataItem => ({ 
      month: t(`General.months.${dataItem.month - 1}`), 
      income: dataItem.data[0].totalIncomes, 
      expenses: dataItem.data[0].totalExpenses,
    }));
    setCashFlow(cashFlowData);
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

  return (
    <div className='space-y-10'>
      <div className='overflow-x-auto'>
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