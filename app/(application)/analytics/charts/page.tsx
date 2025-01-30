import { auth } from '@/auth';
import { ChartBoard } from '../_components';
import { 
  getFundsStructureByCategories, 
  getFundsSummary, 
  getMonthlySavingsControlDataByYears, 
  getRecentActivity
} from '@/lib/actions/analytics.actions';
import { getUser } from '@/lib/actions/user.actions';
import { CURRENCIES } from '@/lib/constants';
import { RecentActivity } from '@/components/data-rendering';


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
  
  const monthlyFunds = await getMonthlySavingsControlDataByYears({
    dateFrom,
    dateTo, 
    currency
  });
  
  const fundsPerCategories = await getFundsStructureByCategories({
    dateFrom,
    dateTo, 
    currency
  });

  const recentActivity = await getRecentActivity({
    dateFrom,
    dateTo, 
    currency
  });

  const fundsSummary = await getFundsSummary({
    dateFrom,
    dateTo, 
    currency
  });

  return (
    <div className='space-y-10'>
      <ChartBoard 
        data={{
          dynamic: monthlyFunds.data,
          structure: fundsPerCategories.data,
        }} 
        currentCurrency={user!.currency || CURRENCIES[0].value} 
      />
      <RecentActivity data={{...recentActivity.data, ...fundsSummary.data}} />
    </div>
  );
};