'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { BadgeDollarSign, Banknote, ChartNoAxesCombined, LayoutDashboard, Settings, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { NavbarItem } from './navbar-item';
import { ModeToggle } from '../theme/mode-toggle';




export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(Boolean(localStorage.getItem('isSidebarExpanded')) || false);
  const pathname = usePathname()

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
  }

  return (
    <div className={cn(
      isExpanded ? 'w-[300px]' : 'w-[70px]',
      'relative p-3 h-screen border-r transition-all duration-300 ease-in-out transform flex flex-col bg-background-secondary'
    )}>
      <div>LOGO</div>
      <nav className={cn(isExpanded ? 'items-start' : 'items-center', 'w-full flex flex-col gap-3')}>
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
      <Button type='button' onClick={handleSidebarExpand}>-</Button>
      <ModeToggle isExpanded={isExpanded} />
    </div>
  );
};