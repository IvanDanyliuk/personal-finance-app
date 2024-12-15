import { getTranslations } from 'next-intl/server';
import { AddIncomeForm, IncomesTable } from './_components';
import { getIncomes } from '@/lib/actions/income.actions';
import NoDataPlaceholder from '@/public/images/investment.svg';
import Image from 'next/image';


export default async function IncomesPage({ searchParams }) {
  const t = await getTranslations();
  const incomes = await getIncomes({});

  return (
    <div className='w-full h-full'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('IncomesPage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <div className='w-full flex justify-between items-center'>
          <div>Filters</div>
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