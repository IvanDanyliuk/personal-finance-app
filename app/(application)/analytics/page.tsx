import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NoChartDataPlaceholder, SavingsData } from './_components';
import { 
  getMonthlySavingsControlDataByYears, 
  getYearsOfSavings 
} from '@/lib/actions/analytics.actions';
import NoDataPlaceholder from '@/public/images/banknote.svg';


export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('General.metadata.analytics');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
};


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
          <NoChartDataPlaceholder 
            image={NoDataPlaceholder} 
            title='AnalyticsPage.charts.noDataMessages.noDataFoundTitle' 
            message='AnalyticsPage.charts.noDataMessages.noDataFoundMessage' 
          />
        )
      }
    </>
  );
};