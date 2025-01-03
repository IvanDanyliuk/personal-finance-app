import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { deleteExpense, getExpenses, updateExpense } from '@/lib/actions/expense.actions';
import { removeFalseyFields } from '@/lib/helpers';
import { ColType } from '@/lib/types/common.types';
import { DataTable } from '@/components/data-rendering';
import NoDataPlaceholder from '@/public/images/investment.svg';
import { CreateExpenseModal, ExpenseFilters } from './_components';


const columns: ColType[] = [
  {
    name: 'date',
    label: 'ExpensesPage.expenseTable.dateColLabel',
    value: '',
    isSortable: true,
  },
  {
    name: 'amount',
    label: 'ExpensesPage.expenseTable.amountColLabel',
    value: '',
    isSortable: true,
  },
  {
    name: 'currency',
    label: 'ExpensesPage.expenseTable.currencyColLabel',
    value: 'General.currencies',
    isSortable: false,
  },
  {
    name: 'category',
    label: 'ExpensesPage.expenseTable.categoryColLabel',
    value: 'ExpensesPage.expense_destinations',
    isSortable: false,
  },
  {
    name: 'paymentMethod',
    label: 'ExpensesPage.expenseTable.paymentMethodColLabel',
    value: 'ExpensesPage.payment_methods',
    isSortable: false,
  },
  {
    name: 'destination',
    label: 'ExpensesPage.expenseTable.destinationColLabel',
    value: '',
    isSortable: false,
  },
  {
    name: 'comment',
    label: 'ExpensesPage.expenseTable.commentColLabel',
    value: '',
    isSortable: false,
  },
];


export default async function ExpensesPage({ searchParams: { 
  page = '1', 
  items = '10', 
  sortBy, 
  order,
  dateFrom,
  dateTo,
  amountFrom,
  amountTo,
  category,
  paymentMethod,
  currency 
} }: {
  searchParams: {
    page: string;
    items: string;
    sortBy: string;
    order: string;
    dateFrom: string;
    dateTo: string;
    amountFrom: string;
    amountTo: string;
    category: string;
    paymentMethod: string;
    currency: string;
  }
}) {
  const t = await getTranslations();

  const additionalParams = removeFalseyFields({
    sortBy, 
    order, 
    dateFrom, 
    dateTo, 
    amountFrom, 
    amountTo, 
    category, 
    currency, 
    paymentMethod
  });

  const expenses = await getExpenses({ 
    page, 
    items, 
    ...additionalParams 
  });

  return (
    <div className='p-3 w-full h-fit border border-background-secondary rounded-3xl'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('ExpensesPage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <div className='w-full flex justify-between items-center'>
          <ExpenseFilters />
          <div className='flex items-center gap-3'>
            <div>Export to PDF</div>
            <CreateExpenseModal />
          </div>
        </div>
        {expenses.data.length > 0 ? (
          <DataTable 
            status={expenses.status} 
            columns={columns}
            data={expenses.data} 
            count={expenses.count}
            updateAction={updateExpense}
            deleteAction={deleteExpense}
            error={expenses.error} 
          />
        ) : (
          <div className='w-full flex flex-col justify-center items-center gap-8'>
            <Image 
              src={NoDataPlaceholder} 
              alt='No data' 
              width={500} 
              height={500} 
            />
            <p className='text-lg'>
              {t('ExpensesPage.noData')}
            </p>
            <CreateExpenseModal />
          </div>
        )}
      </div>
    </div>
  );
};