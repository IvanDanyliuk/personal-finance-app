import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useTranslations } from 'next-intl';


interface INoChartDataPlaceholder {
  image: StaticImport | string;
  message: string;
};


export const NoChartDataPlaceholder: React.FC<INoChartDataPlaceholder> = ({ 
  image, 
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
      <p className='text-center font-semibold text-primary-7'>
        {t(message)}
      </p>
    </div>
  );
};