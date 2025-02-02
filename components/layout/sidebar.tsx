'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions/auth.actions';
import { Button } from '../ui/button';
import { Logo, MenuLinks } from './';
import { ModeToggle } from '../theme/mode-toggle';


export const Sidebar = () => {
  const t = useTranslations('Layout');
  const [isExpanded, setIsExpanded] = useState<boolean>(
    Boolean(localStorage.getItem('isSidebarExpanded')) || false
  );

  const user = true;

  const handleSidebarExpand = () => {
    setIsExpanded(!isExpanded);
    localStorage.setItem('isSidebarExpanded', `${!isExpanded}`);
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className={cn(
      isExpanded ? 'w-[300px]' : 'w-[70px]',
      'relative p-3 h-screen border-r transition-all duration-300 ease-in-out transform hidden md:flex flex-col justify-between bg-background-secondary'
    )}>
      <div>
        <Logo />
        <Button 
          type='button' 
          onClick={handleSidebarExpand} 
          className={cn(isExpanded ? 'right-3' : 'right-[18px]', 'absolute w-8 h-8 rounded-full')}
        >
          {isExpanded ? (
            <ChevronLeft className='w-4 h-4' />
          ) : (
            <ChevronRight className='w-4 h-4' />
          )}
        </Button>
        <div className='mt-12'>
          <MenuLinks isExpanded={isExpanded} />
        </div>
      </div>
      
      <div className='mb-3 flex flex-col items-center gap-6'>
        {user && (
          <button 
            type='button' 
            onClick={handleSignOut} 
            className='w-fit flex items-center gap-1 bg-transparent p-0 border-none shadow-none text-foreground text-md'
          >
            <LogOut className='w-5 h-5' />
            {isExpanded && (
              <span>
                {t('logoutBtn')}
              </span>
            )}
          </button>
        )}
        <ModeToggle isExpanded={isExpanded} />
      </div>
    </div>
  );
};