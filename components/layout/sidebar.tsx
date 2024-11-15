'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  BadgeDollarSign, 
  Banknote, 
  ChartNoAxesCombined, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Wallet 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { NavbarItem } from './navbar-item';
import { ModeToggle } from '../theme/mode-toggle';


export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(
    Boolean(localStorage.getItem('isSidebarExpanded')) || false
  );
  const pathname = usePathname();

  const user = true;

  const links = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard />,
      active: pathname === '/'
    },
    {
      label: 'Expenses',
      path: '/expenses',
      icon: <BadgeDollarSign />,
      active: pathname.includes('/expenses')
    },
    {
      label: 'Incomes',
      path: '/incomes',
      icon: <Banknote />,
      active: pathname.includes('/incomes')
    },
    {
      label: 'Savings',
      path: '/savings',
      icon: <Wallet />,
      active: pathname.includes('/savings')
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <ChartNoAxesCombined />,
      active: pathname.includes('/analytics')
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
      active: pathname.includes('/settings')
    },
  ];

  const handleSidebarExpand = () => {
    setIsExpanded(!isExpanded);
    localStorage.setItem('isSidebarExpanded', `${!isExpanded}`);
  };

  const handleSignOut = () => {
    console.log('SIGN OUT');
  };

  return (
    <div className={cn(
      isExpanded ? 'w-[300px]' : 'w-[70px]',
      'relative p-3 h-screen border-r transition-all duration-300 ease-in-out transform flex flex-col justify-between bg-background-secondary'
    )}>
      <div>
        <div>LOGO</div>
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
        <nav className={cn(isExpanded ? 'items-start' : 'items-center', 'mt-12 w-full flex flex-col gap-3')}>
          {links.map(link => (
            <NavbarItem 
              key={crypto.randomUUID()} 
              label={link.label} 
              path={link.path} 
              icon={link.icon} 
              isActive={link.active} 
              isSidebarExpanded={isExpanded} 
            />
          ))}
        </nav>
      </div>
      
      <div className='mb-3 flex flex-col items-center gap-6'>
        {user && (
          <button 
            type='button' 
            onClick={handleSignOut} 
            className='w-fit flex items-center gap-1 bg-transparent p-0 border-none shadow-none text-foreground text-md'
          >
            <LogOut className='w-5 h-5' />
            {isExpanded && <span>Log out</span>}
          </button>
        )}
        <ModeToggle isExpanded={isExpanded} />
      </div>
    </div>
  );
};