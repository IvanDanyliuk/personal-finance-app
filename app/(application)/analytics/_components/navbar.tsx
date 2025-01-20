'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const Navbar: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className='flex'>
      <Link 
        href='/analytics' 
        className={cn(
          pathname === '/analytics' ? ' bg-primary-7 text-white' : 'bg-background-secondary text-foreground', 
          'w-72 py-3 text-center font-semibold border border-primary-7 rounded-l-full'
        )}
      >
        {t('AnalyticsPage.navbar.main')}
      </Link>
      <Link 
        href='/analytics/charts' 
        className={cn(
          pathname === '/analytics/charts' ? ' bg-primary-7 text-white' : 'bg-background-secondary text-foreground', 
          'w-72 py-3 text-center font-semibold border border-primary-7 rounded-r-full'
        )}
      >
        {t('AnalyticsPage.navbar.charts')}
      </Link>
    </div>
  );
};