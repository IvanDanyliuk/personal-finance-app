import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';


interface INavbarItem {
  label: string;
  icon: ReactNode;
  path: string;
  isActive: boolean;
  isSidebarExpanded?: boolean;
};


export const NavbarItem: React.FC<INavbarItem> = ({ 
  label, 
  icon, 
  path, 
  isActive, 
  isSidebarExpanded 
}) => {
  const t = useTranslations('Navigation');

  return (
    <>
      {isSidebarExpanded ? (
        <Link 
          href={path} 
          className={cn(
            isActive ? 'bg-primary-7 text-white' : 'bg-transparent hover:bg-primary-3 text-foreground', 
            'w-full px-4 py-3 rounded-full text-md font-semibold'
          )}
        >
          <div className='flex items-center gap-3 '>
            {icon}
            <span>
              {t(label)}
            </span>
          </div>
        </Link>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={path} className='text-md'>
                <div className={cn(
                  isActive ? 'bg-primary-7 text-white' : 'bg-transparent hover:bg-primary-3 text-foreground', 
                  'p-3 rounded-full'
                  )}>
                  {icon}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>
              <div className='px-3 py-2 text-white bg-primary-7 rounded-full'>
                {t(label)}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};