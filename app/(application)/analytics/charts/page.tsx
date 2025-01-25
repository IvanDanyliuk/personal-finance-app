import { auth } from '@/auth';
import { ChartBoard } from '../_components';
import { getFundsStructureByCategories, getMonthlySavingsControlDataByYears } from '@/lib/actions/analytics.actions';
import { getUser } from '@/lib/actions/user.actions';
import { CURRENCIES } from '@/lib/constants';


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
  const session = await auth();
  const user = await getUser(session!.user!.email!);

  const currentYear = new Date().getFullYear();
  const period = !dateFrom && !dateTo 
    ? { 
        dateFrom: `${currentYear}-01-01T00:00:00.000Z`, 
        dateTo: `${currentYear + 1}-01-01T00:00:00.000Z`, 
        currency: currency || user!.currency!
      }
    : {
        dateFrom,
        dateTo, 
        currency: currency || user!.currency!
      };

  
  const monthlyFunds = await getMonthlySavingsControlDataByYears(period);
  const fundsPerCategories = await getFundsStructureByCategories(period);

  return (
    <div>
      <ChartBoard 
        data={{
          dynamic: monthlyFunds.data,
          structure: fundsPerCategories.data
        }} 
        currentCurrency={user!.currency || CURRENCIES[0].value} 
      />
    </div>
  );
};