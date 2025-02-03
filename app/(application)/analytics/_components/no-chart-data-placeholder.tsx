import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useTranslations } from 'next-intl';


interface INoChartDataPlaceholder {
  image: StaticImport | string;
  title: string;
  message?: string;
};


export const NoChartDataPlaceholder: React.FC<INoChartDataPlaceholder> = ({ 
  image, 
  title, 
  message 
}) => {
  const t = useTranslations();

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <Image 
        src={image}
        alt='chart placeholder'
        width={300}
        height={300}
      />
      <h2 className='text-sm md:text-xl text-primary-7 text-center font-semibold'>
        {t(title)}
      </h2>
      {message && (
        <p className='text-center text-xs md:text-base font-semibold text-secondary-5'>
          {t(message)}
        </p>
      )}
    </div>
  );
};