import { getTranslations } from 'next-intl/server';
import { CreateIncomeModal } from './_components';
import { deleteIncome, getIncomes, updateIncome } from '@/lib/actions/income.actions';
import NoDataPlaceholder from '@/public/images/investment.svg';
import Image from 'next/image';
import { removeFalseyFields } from '@/lib/helpers';
import { IncomeFilters } from './_components/income-filters';
import { ColType } from '@/lib/types/common.types';
import { DataTable } from '@/components/data-rendering';


const columns: ColType[] = [
  {
    name: 'date',
    label: 'IncomesPage.incomesTable.dateColLabel',
    value: '',
    isSortable: true,
  },
  {
    name: 'amount',
    label: 'IncomesPage.incomesTable.amountColLabel',
    value: '',
    isSortable: true,
  },
  {
    name: 'currency',
    label: 'IncomesPage.incomesTable.currencyColLabel',
    value: 'General.currencies',
    isSortable: false,
  },
  {
    name: 'source',
    label: 'IncomesPage.incomesTable.sourceColLabel',
    value: 'IncomesPage.income_sources',
    isSortable: false,
  },
  {
    name: 'comment',
    label: 'IncomesPage.incomesTable.commentColLabel',
    value: '',
    isSortable: false,
  },
];


export default async function IncomesPage({ searchParams: { 
  page = '1', 
  items = '10', 
  sortBy, 
  order,
  dateFrom,
  dateTo,
  amountFrom,
  amountTo,
  source,
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
    source: string;
    currency: string;
  }
}) {
  const t = await getTranslations();
  const additionalParams = removeFalseyFields({
    sortBy, order, dateFrom, dateTo, amountFrom, amountTo, source, currency
  });
  const incomes = await getIncomes({ page, items, ...additionalParams });

  return (
    <div className='p-3 w-full h-fit border border-background-secondary rounded-3xl'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('IncomesPage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <div className='w-full flex justify-between items-center'>
          <IncomeFilters />
          <div className='flex items-center gap-3'>
            <div>Export to PDF</div>
            <CreateIncomeModal />
          </div>
        </div>
        {incomes.data.length > 0 ? (
          <DataTable 
            status={incomes.status} 
            columns={columns}
            data={incomes.data} 
            count={incomes.count}
            updateAction={updateIncome}
            deleteAction={deleteIncome}
            error={incomes.error} 
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
              {t('IncomesPage.noData')}
            </p>
            <CreateIncomeModal />
          </div>
        )}
      </div>
    </div>
  );
};