'use client';

import Image from 'next/image';
import { LogOut, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';
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
        <SheetContent className='bg-background'>
          <DialogTitle>
            <Logo />
          </DialogTitle>
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
          <div className='py-3 w-full h-full flex flex-col justify-between'>
            <MenuLinks isExpanded={true} />
            <div className='mb-3 flex flex-col items-center gap-6'>
              {userName && email && (
                <button 
                  type='button' 
                  onClick={handleSignOut} 
                  className='w-fit flex items-center gap-1 bg-transparent p-0 border-none shadow-none text-foreground text-md'
                >
                  <LogOut className='w-5 h-5' />
                  <span>Log out</span>
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