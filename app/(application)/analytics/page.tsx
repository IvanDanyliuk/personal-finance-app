import { getSavingsControlData, getYearsOfSavings } from '@/lib/actions/analytics.actions';

export default async function AnalyticsPage() {
  const years = await getYearsOfSavings();
  const analyticsData = years.data.length > 0 ? await getSavingsControlData(years.data[0]) : null;

  console.log('ANALYTICS', years)

  return (
    <div>
      Analytics
    </div>
  );
};