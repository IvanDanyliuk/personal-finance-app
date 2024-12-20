import { getTranslations } from 'next-intl/server';
import { AddIncomeForm, IncomesTable } from './_components';
import { getIncomes } from '@/lib/actions/income.actions';
import NoDataPlaceholder from '@/public/images/investment.svg';
import Image from 'next/image';
import { removeFalseyFields } from '@/lib/helpers';
import { IncomeFilters } from './_components/income-filters';


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
            <AddIncomeForm />
          </div>
        </div>
        {incomes.data.length > 0 ? (
          <IncomesTable 
            status={incomes.status} 
            data={incomes.data} 
            count={incomes.count}
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
            <AddIncomeForm />
          </div>
        )}
      </div>
    </div>
  );
};