import { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import NoDataPlaceholder from '@/public/images/investment.svg';


interface INoFundsDataPlaceholder {
  title: string;
  children: ReactNode;
};


export const NoFundsDataPlaceholder: React.FC<INoFundsDataPlaceholder> = ({
  title,
  children
}) => {
  const t = useTranslations();

  return (
    <div className='w-full flex flex-col justify-center items-center gap-8'>
      <Image 
        src={NoDataPlaceholder} 
        alt='No data' 
        width={500} 
        height={500} 
      />
      <p className='text-lg text-center text-secondary-4 font-semibold'>
        {t(title)}
      </p>
      {children}
    </div>
  );
};