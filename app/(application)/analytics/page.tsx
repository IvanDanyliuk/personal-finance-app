import { getMonthlySavingsControlDataByYears, getYearsOfSavings } from '@/lib/actions/analytics.actions';
import { SavingsData } from './_components';


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
          <div>No data found</div>
        )
      }
    </>
  );
};