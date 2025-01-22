import { getMonthlySavingsControlDataByYears } from '@/lib/actions/analytics.actions';
import { ChartBoard } from '../_components';

export default async function AnalyticCharts({ 
  searchParams: { 
    dateFrom, 
    dateTo, 
    currency 
  } 
}: { 
  searchParams: { 
    dateFrom: string; 
    dateTo: string; 
    currency?: string; 
  } 
}) {
  const currentYear = new Date().getFullYear();
  const period = !dateFrom && !dateTo 
    ? { 
        dateFrom: `${currentYear}-01-01T00:00:00.000Z`, 
        dateTo: `${currentYear + 1}-01-01T00:00:00.000Z`, 
        currency
      }
    : {
        dateFrom,
        dateTo, 
        currency
      };
  const montlyFunds = await getMonthlySavingsControlDataByYears(period);

  console.log('MONTHLY FUNDS', montlyFunds.data[0])

  return (
    <div>
      <ChartBoard />
    </div>
  );
};