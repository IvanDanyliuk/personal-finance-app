'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChartConfig } from '@/components/ui/chart';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import { CashFlow, ExpensesStructure, IncomeStructure } from '@/lib/types/analytics.types';
import { CustomBarChart, CustomPieChart } from '@/components/data-rendering';
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
  } satisfies ChartConfig;

  const expensesStructureConfig = {
    category: {
      label: t('AnalyticsPage.charts.fundsStructure.expenses'),
      color: 'bg-primary-5'
    }
  } satisfies ChartConfig;

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
    <div>
      <h1 className='text-xl text-center font-semibold'>
        {t('HomePage.keyIndicatorsSection.title')}
      </h1>
      <p className='text-center md:text-right text-xs text-primary-6'>
        {t('HomePage.keyIndicatorsSection.note')}
      </p>
      <div className='mt-5 space-y-10'>
        <CustomBarChart 
          title='AnalyticsPage.charts.cashFlow.title' 
          data={cashFlow} 
          config={cashFlowChartConfig} 
          dataKeys={['income', 'expenses']}
          fillColors={['hsl(var(--primary-7))', 'hsl(var(--primary-4))']}
          noDataImage={NoCashFlowData} 
          noDataMessage='AnalyticsPage.charts.noDataMessages.cashFlow' 
        />
        <div className='w-full flex flex-col md:flex-row gap-6'>
          <CustomPieChart 
            data={incomeStructure}
            config={incomeStructureConfig}
            title='AnalyticsPage.charts.fundsStructure.income'
            nameKey='source'
            noDataImage={NoCashFlowData}
            noDataMessage='AnalyticsPage.charts.noDataMessages.income'
          />
          <CustomPieChart 
            data={expensesStructure}
            config={expensesStructureConfig}
            title='AnalyticsPage.charts.fundsStructure.expenses'
            nameKey='category'
            noDataImage={NoCashFlowData}
            noDataMessage='AnalyticsPage.charts.noDataMessages.expenses'
          />
        </div>
      </div>
    </div>
  );
};