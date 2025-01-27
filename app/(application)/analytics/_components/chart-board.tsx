'use client'

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  CustomBarChart, 
  CustomPieChart, 
  DateFilters 
} from '@/components/data-rendering';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { type ChartConfig } from '@/components/ui/chart';
import { 
  CashFlow, 
  ExpensesStructure, 
  FundsData, 
  IncomeStructure 
} from '@/lib/types/analytics.types';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import NoCashFlowData from '@/public/images/business-vision.svg';


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
      <CustomBarChart 
        title='AnalyticsPage.charts.cashFlow.title' 
        data={cashFlow} 
        config={cashFlowChartConfig} 
        dataKeys={['income', 'expenses']}
        fillColors={['hsl(var(--primary-7))', 'hsl(var(--primary-4))']}
        noDataImage={NoCashFlowData} 
        noDataMessage='AnalyticsPage.charts.noDataMessages.cashFlow' 
      />
      <CustomBarChart 
        title='AnalyticsPage.charts.income' 
        data={income} 
        config={incomeLineChartConfig} 
        dataKeys={['value']}
        fillColors={['hsl(var(--primary-7))']}
        noDataImage={NoCashFlowData} 
        noDataMessage='AnalyticsPage.charts.noDataMessages.income' 
      />
      <CustomBarChart 
        title='AnalyticsPage.charts.expenses' 
        data={expenses} 
        config={expensesLineChartConfig} 
        dataKeys={['value']}
        fillColors={['hsl(var(--primary-7))']}
        noDataImage={NoCashFlowData} 
        noDataMessage='AnalyticsPage.charts.noDataMessages.expenses' 
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
  );
};