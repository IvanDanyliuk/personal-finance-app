import { getMonthlySavingsControlDataByYears, getYearsOfSavings } from '@/lib/actions/analytics.actions';
import { SavingsData } from './_components';


export default async function AnalyticsPage({ 
  searchParams: { year } 
}: { 
  searchParams: { year: string } 
}) {
  const years = await getYearsOfSavings();
  const analyticsData = years.data.length > 0 
    ? await getMonthlySavingsControlDataByYears(year ? +year : years.data[0]) 
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