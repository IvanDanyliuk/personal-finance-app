import { getTranslations } from 'next-intl/server';
import { BalanceSection } from './_components';
import { getBanks } from '@/lib/actions/bank.actions';
import { getFunds } from '@/lib/actions/account.actions';


export default async function Home({ 
  searchParams: { country } 
}: { 
  searchParams: { country: string } 
}) {
  const t = await getTranslations();
  const banksByCountry = await getBanks(country);
  const funds = await getFunds();

  console.log('FUNDS', funds)

  return (
    <div className='p-3 w-full h-fit border border-background-secondary rounded-3xl'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('HomePage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <BalanceSection banks={banksByCountry.data} funds={funds.data || []} />      
      </div>
    </div>
  );
};