import { getTranslations } from 'next-intl/server';
import { BalanceSection, KeyIndicatorsSection } from './_components';
import { getBanks } from '@/lib/actions/bank.actions';
import { getFunds } from '@/lib/actions/account.actions';
import { getMonthlySavingsControlDataByYears } from '@/lib/actions/analytics.actions';


export default async function Home({ 
  searchParams: { country } 
}: { 
  searchParams: { country: string } 
}) {
  const t = await getTranslations();
  const banksByCountry = await getBanks(country);
  const funds = await getFunds();
  const analytics = await getMonthlySavingsControlDataByYears({});

  return (
    <div className='p-3 w-full h-fit border border-background-secondary rounded-3xl'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('HomePage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <BalanceSection 
          banks={banksByCountry.data} 
          funds={funds.data} 
        />  
        <KeyIndicatorsSection
          data={analytics.data}
        />    
      </div>
    </div>
  );
};