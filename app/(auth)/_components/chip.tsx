import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';


interface IChip {
  icon: ReactNode;
  label: string;
  className?: string;
};


export const Chip: React.FC<IChip> = ({
  icon, label, className
}) => {
  const t = useTranslations();

  return (
    <div className={cn('flex items-center', className)}>
      <div className='w-12 h-12 flex justify-center items-center bg-primary-6 text-secondary-1 rounded-full'>
        {icon}
      </div>
      <div className='w-fit h-12 px-6 flex items-center border border-secondary-1 rounded-full'>
        <p className='text-sm text-center font-semibold'>
          {t(label)}
        </p>
      </div>
    </div>
  );
};