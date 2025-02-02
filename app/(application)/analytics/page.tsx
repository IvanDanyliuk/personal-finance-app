import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { SavingsData } from './_components';
import { 
  getMonthlySavingsControlDataByYears, 
  getYearsOfSavings 
} from '@/lib/actions/analytics.actions';
import NoDataPlaceholder from '@/public/images/banknote.svg';
// import { generateMetadata } from '@/lib/utils';


// export const metadata = generateMetadata('General.metadata.analytics');


export default async function AnalyticsPage({ 
  searchParams: { 
    dateFrom, 
    dateTo 
  } 
}: { 
  searchParams: { 
    dateFrom: string; 
    dateTo: string; 
  } 
}) {
  const t = await getTranslations();
  const years = await getYearsOfSavings();

  const period = {
    dateFrom: dateFrom || new Date(`${years.data[0]}-01-01T00:00:00.000Z`).toString(),
    dateTo: dateTo || new Date(`${years.data[0]}-12-31T23:59:59.999Z`).toString(),
  }
  const analyticsData = years.data.length > 0 
    ? await getMonthlySavingsControlDataByYears(period) 
    : null;

  return (
    <>
      {
        years.data.length > 0 && analyticsData ? (
          <SavingsData 
            years={years.data} 
            data={analyticsData.data} 
          />
        ) : (
          <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
            <Image src={NoDataPlaceholder} alt='No data' width={500} height={500} />
            <h2 className='text-xl text-primary-7 font-bold'>
              {t('AnalyticsPage.charts.noDataMessages.noDataFoundTitle')}
            </h2>
            <p className='text-secondary-4'>
              {t('AnalyticsPage.charts.noDataMessages.noDataFoundMessage')}
            </p>
          </div>
        )
      }
    </>
  );
};