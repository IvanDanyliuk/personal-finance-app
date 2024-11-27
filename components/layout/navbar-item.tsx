import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils';


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
              {label}
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
            <TooltipContent className='text-secondary-9 bg-white' side='right'>
              <span>
                {label}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};