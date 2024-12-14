import { AddIncomeForm, IncomesTable } from './_components';
import { getIncomes } from '@/lib/actions/income.actions';
import { getTranslations } from 'next-intl/server';


export default async function IncomesPage() {
  const t = await getTranslations();
  const incomes = await getIncomes();

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
            error={incomes.error} 
          />
        ) : (
          <div>No data</div>
        )}
      </div>
    </div>
  );
};