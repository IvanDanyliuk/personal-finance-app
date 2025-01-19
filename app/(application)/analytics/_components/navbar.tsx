'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const Navbar: React.FC = () => {
  const pathname = usePathname();
  console.log('NAVBAR', pathname)

  return (
    <div className='flex'>
      <Link 
        href='/analytics' 
        className={cn(
          pathname === '/analytics' ? ' bg-primary-7 text-white' : 'bg-primary-1 text-secondary-5', 
          'w-52 py-3 text-center font-semibold border border-primary-7 rounded-l-full'
        )}
      >
        Main
      </Link>
      <Link 
        href='/analytics/charts' 
        className={cn(
          pathname === '/analytics/charts' ? ' bg-primary-7 text-white' : 'bg-primary-1 text-secondary-5', 
          'w-52 py-3 text-center font-semibold border border-primary-7 rounded-r-full'
        )}
      >
        Charts
      </Link>
    </div>
  );
};