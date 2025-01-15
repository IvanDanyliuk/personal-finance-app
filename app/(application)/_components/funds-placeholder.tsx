import Image from 'next/image';
import NoAccountsPlaceholder from '@/public/images/savings.svg';
import { useTranslations } from 'next-intl';


interface IFundsPlaceholder {
  title: string;
  message: string;
};


export const FundsPlaceholder: React.FC<IFundsPlaceholder> = ({
  title, 
  message
}) => {
  const t = useTranslations();

  return (
    <div className='flex justify-center items-center'>
      <Image 
        src={NoAccountsPlaceholder}
        alt='No accounts found'
        width={178}
        height={178}
      />
      <div className='space-y-3 text-secondary-4'>
        <h4 className='text-center text-xl font-semibold'>
          {t(title)}
        </h4>
        <p className='text-center'>
          {t(message)}
        </p>
      </div>
    </div>
  );
};