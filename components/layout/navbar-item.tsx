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
  isSidebarExpanded: boolean;
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
            isActive ? 'bg-primary-7 text-white' : 'bg-transparent hover:bg-primary-3 text-black', 
            'w-full px-4 py-3 rounded-full text-md'
          )}
        >
          <div className='flex items-center gap-1'>
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
                <div>
                  {icon}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
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