import { useTranslations } from "next-intl";

export default function IncomesPage() {
  const t = useTranslations('IncomesPage');
  
  return (
    <div className='w-full h-full'>
      <h1 className='mb-3 text-xl md:text-3xl font-semibold'>
        {t('title')}
      </h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6'>
        
      </div>
    </div>
  );
};