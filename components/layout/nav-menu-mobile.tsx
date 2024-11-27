'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LogOut, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from './logo';
import { Separator } from '../ui/separator';
import { MenuLinks } from './menu-links';
import { logout } from '@/lib/actions/auth.actions';
import { ModeToggle } from '../theme/mode-toggle';


interface INavMenuMobile {
  userName: string;
  email: string;
  userImage: string;
};


export const NavMenuMobile: React.FC<INavMenuMobile> = ({ userName, email, userImage }) => {
  const t = useTranslations('Layout')
  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <button>
            <Menu className='size-8' />
          </button>
        </SheetTrigger>
        <SheetContent className='py-10'>
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <div className='h-full flex flex-1 flex-col justify-between bg-background'>
            <div>
              <div className='mt-3 flex items-center gap-3'>
                <Image 
                  src={userImage} 
                  alt={userName} 
                  width={40} 
                  height={40} 
                  className='rounded-full' 
                />
                <div>
                  <p className='text-foreground text-sm font-semibold'>
                    {userName}
                  </p>
                  <p className='text-secondary-3 text-xs'>
                    {email}
                  </p>
                </div>
              </div>
              <Separator className='my-3' />
              <MenuLinks isExpanded={true} />
            </div>
            <div className='mb-3 flex flex-col items-center gap-6'>
              {userName && email && (
                <button 
                  type='button' 
                  onClick={handleSignOut} 
                  className='w-fit flex items-center gap-1 bg-transparent p-0 border-none shadow-none text-foreground text-md'
                >
                  <LogOut className='w-5 h-5' />
                  <span>
                    {t('logoutBtn')}
                  </span>
                </button>
              )}
              <ModeToggle isExpanded={true} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};