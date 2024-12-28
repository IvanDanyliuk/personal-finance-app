import { useTranslations } from 'next-intl';
import { BalanceSection } from './_components';


export default function Home() {
  const t = useTranslations();

  return (
    <div className='p-3 w-full h-fit border border-background-secondary rounded-3xl'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('HomePage.title')}
      </h1>
      <div className='w-full flex flex-col gap-3'>
        <BalanceSection />      
      </div>
    </div>
  );
};