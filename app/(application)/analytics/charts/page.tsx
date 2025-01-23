import { getMonthlySavingsControlDataByYears } from '@/lib/actions/analytics.actions';
import { ChartBoard } from '../_components';
import { auth } from '@/auth';
import { getUser } from '@/lib/actions/user.actions';


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

  const session = await auth();
  const user = await getUser(session!.user!.email!);
  const monthlyFunds = await getMonthlySavingsControlDataByYears(period);

  return (
    <div>
      {JSON.stringify(monthlyFunds.data)}
      <ChartBoard data={monthlyFunds.data} currentCurrency={user!.currency} />
    </div>
  );
};