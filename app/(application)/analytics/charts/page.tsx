import { getMonthlySavingsControlDataByYears } from '@/lib/actions/analytics.actions';
import { ChartBoard } from '../_components';

export default async function AnalyticCharts({ 
  searchParams: { dateFrom, dateTo } 
}: { 
  searchParams: { dateFrom: string; dateTo: string; } 
}) {
  const currentYear = new Date().getFullYear();
  const period = !dateFrom && !dateTo 
    ? { 
        dateFrom: `${currentYear}-01-01T00:00:00.000Z`, 
        dateTo: `${currentYear + 1}-01-01T00:00:00.000Z` 
      }
    : {
        dateFrom,
        dateTo
      };
  const montlyFunds = await getMonthlySavingsControlDataByYears(period);

  console.log('MONTHLY FUNDS', montlyFunds)

  return (
    <div>
      <ChartBoard />
    </div>
  );
};