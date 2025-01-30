import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import NoDataPlaceholder from '@/public/images/investment.svg';


interface INoAccountsDataPlaceholder {
  title: string;
  linkLabel: string;
};


export const NoAccountsDataPlaceholder: React.FC<INoAccountsDataPlaceholder> = ({
  title,
  linkLabel
}) => {
  const t = useTranslations();

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
      <Image 
        src={NoDataPlaceholder} 
        alt='No data' 
        width={500} 
        height={500} 
      />
      <p className='text-lg text-center text-secondary-4 font-semibold'>
        {t(title)}
      </p>
      <Link href='/' className='px-6 py-2 bg-primary-6 text-white rounded-full'>
        {t(linkLabel)}
      </Link>
    </div>
  );
};