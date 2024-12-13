import { useTranslations } from 'next-intl';
import { AddIncomeForm } from './_components/add-income-form';

export default function IncomesPage() {
  const t = useTranslations('IncomesPage');
  
  return (
    <div className='w-full h-full'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('title')}
      </h1>
      <div className='w-full'>
        <div className='w-full flex justify-between items-center'>
          <div>Filters</div>
          <div className='flex items-center gap-3'>
            <div>Export to PDF</div>
            <AddIncomeForm />
          </div>
        </div>
      </div>
    </div>
  );
};