'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { ExpenseSchema } from '@/lib/types/form-schemas/expenses';


interface Income extends IncomeSchema {
  id: string;
};

interface Expense extends ExpenseSchema {
  id: string;
};

interface IRecentActivity {
  data: {
    recentTransactions: any[];
    topIncomes?: Income[];
    topExpenses?: Expense[];
    incomeSummary?: {
      currency: string;
      value: number;
    }[];
    expensesSummary?: {
      currency: string;
      value: number;
    }[];
  };
};


export const RecentActivity: React.FC<IRecentActivity> = ({ data }) => {
  const { 
    recentTransactions, 
    topIncomes, 
    topExpenses, 
    incomeSummary, 
    expensesSummary 
  } = data;
  
  const t = useTranslations();

  return (
    <div className='relative w-full px-3 flex flex-col md:flex-row gap-6'>
      <div className='flex-1'>
        <h2 className='mb-3 text-base text-center font-semibold'>
          {t('AnalyticsPage.recentActivity.recentActivityTable.title')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow className='text-sm border-none'>
              <TableHead className='px-5 bg-background-normal rounded-l-full'>
                {t('AnalyticsPage.recentActivity.recentActivityTable.dateColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.recentActivity.recentActivityTable.amountColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.recentActivity.recentActivityTable.currencyColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.recentActivity.recentActivityTable.categoryColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal rounded-r-full'>
                {t('AnalyticsPage.recentActivity.recentActivityTable.accountColLabel')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction, ) => (
              <TableRow key={crypto.randomUUID()} className='text-xs'>
                <TableCell className='px-5 font-medium'>
                  {format(transaction.date, 'dd.MM.yyyy')}
                </TableCell>
                <TableCell className={cn(
                  transaction.category 
                    ? 'text-danger-2' 
                    : transaction.source 
                      ? 'text-success-2' 
                      : '', 
                  'px-5 font-semibold'
                )}>
                  {transaction.category 
                    ? `-${transaction.amount}` 
                    : transaction.source 
                      ? `+${transaction.amount}` 
                      : transaction.amount
                  }
                </TableCell>
                <TableCell className='px-5'>
                  {t(`General.currencies.${transaction.currency}`)}
                </TableCell>
                <TableCell className='px-5'>
                  {transaction.category 
                    ? t(`ExpensesPage.expense_destinations.${transaction.category}`) 
                    : transaction.source 
                      ? t(`IncomesPage.income_sources.${transaction.source}`) 
                      : '-'
                  }
                </TableCell>
                <TableCell className='px-5'>
                  {transaction.bankAccount.accountNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(topIncomes || topExpenses || incomeSummary || expensesSummary) && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {topIncomes && (
            <div>
              <h2 className='mb-3 text-base text-center font-semibold'>
                {t('AnalyticsPage.recentActivity.topIncome')}
              </h2>
              <Table>
                <TableHeader className='text-sm border-none'>
                  <TableRow className='text-sm border-none'>
                    <TableHead className='px-5 bg-background-normal rounded-l-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.dateColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.amountColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.currencyColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal rounded-r-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.categoryColLabel')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topIncomes.map(income => (
                    <TableRow key={crypto.randomUUID()} className='text-xs'>
                      <TableCell className='px-5 font-medium'>
                        {format(income.date, 'dd.MM.yyyy')}
                      </TableCell>
                      <TableCell className='px-5 font-medium'>
                        {income.amount}
                      </TableCell>
                      <TableCell className='px-5'>
                        {t(`General.currencies.${income.currency}`)}
                      </TableCell>
                      <TableCell className='px-5'>
                        {t(`IncomesPage.income_sources.${income.source}`)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {topExpenses && (
            <div>
              <h2 className='mb-3 text-base text-center font-semibold'>
                {t('AnalyticsPage.recentActivity.topExpense')}
              </h2>
              <Table>
                <TableHeader className='text-sm border-none'>
                  <TableRow className='text-sm border-none'>
                    <TableHead className='px-5 bg-background-normal rounded-l-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.dateColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.amountColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.currencyColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal rounded-r-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.categoryColLabel')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topExpenses.map(expense => (
                    <TableRow key={crypto.randomUUID()} className='text-xs'>
                      <TableCell className='px-5 font-medium'>
                        {format(expense.date, 'dd.MM.yyyy')}
                      </TableCell>
                      <TableCell className='px-5 font-medium'>
                        {expense.amount}
                      </TableCell>
                      <TableCell className='px-5'>
                        {t(`General.currencies.${expense.currency}`)}
                      </TableCell>
                      <TableCell className='px-5'>
                        {t(`ExpensesPage.expense_destinations.${expense.category}`)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {incomeSummary && (
            <div>
              <h2 className='mb-3 text-base text-center font-semibold'>
                {t('AnalyticsPage.recentActivity.totalIncome')}
              </h2>
              <Table>
                <TableHeader className='text-sm border-none'>
                  <TableRow className='text-sm border-none'>
                    <TableHead className='px-5 bg-background-normal rounded-l-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.currencyColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal rounded-r-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.amountColLabel')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeSummary.map(item => (
                    <TableRow key={crypto.randomUUID()} className='text-xs'>
                      <TableCell className='px-5'>
                        {t(`General.currencies.${item.currency}`)}
                      </TableCell>
                      <TableCell className='px-5 font-medium'>
                        {item.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {expensesSummary && (
            <div>
              <h2 className='mb-3 text-base text-center font-semibold'>
                {t('AnalyticsPage.recentActivity.totalExpenses')}
              </h2>
              <Table>
                <TableHeader className='text-sm border-none'>
                  <TableRow className='text-sm border-none'>
                    <TableHead className='px-5 bg-background-normal rounded-l-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.currencyColLabel')}
                    </TableHead>
                    <TableHead className='px-5 bg-background-normal rounded-r-full'>
                      {t('AnalyticsPage.recentActivity.recentActivityTable.amountColLabel')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesSummary.map(item => (
                    <TableRow key={crypto.randomUUID()} className='text-xs'>
                      <TableCell className='px-5'>
                        {t(`General.currencies.${item.currency}`)}
                      </TableCell>
                      <TableCell className='px-5 font-medium'>
                        {item.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};