'use client';

import { usePathname } from 'next/navigation';
import { 
  BadgeDollarSign, 
  Banknote, 
  ChartNoAxesCombined,
  LayoutDashboard, 
  Settings, 
  Wallet 
} from 'lucide-react';
import { NavbarItem } from './'
import { cn } from '@/lib/utils';


export const MenuLinks = ({ isExpanded }: { isExpanded?: boolean }) => {
  const pathname = usePathname();

  const links = [
    {
      label: 'links.dashboard',
      path: '/',
      icon: <LayoutDashboard />,
      active: pathname === '/'
    },
    {
      label: 'links.expenses',
      path: '/expenses',
      icon: <BadgeDollarSign />,
      active: pathname.includes('/expenses')
    },
    {
      label: 'links.incomes',
      path: '/incomes',
      icon: <Banknote />,
      active: pathname.includes('/incomes')
    },
    {
      label: 'links.savings',
      path: '/savings',
      icon: <Wallet />,
      active: pathname.includes('/savings')
    },
    {
      label: 'links.analytics',
      path: '/analytics',
      icon: <ChartNoAxesCombined />,
      active: pathname.includes('/analytics')
    },
    {
      label: 'links.settings',
      path: '/settings',
      icon: <Settings />,
      active: pathname.includes('/settings')
    },
  ];

  return (
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
  );
};