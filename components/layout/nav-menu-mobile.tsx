'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
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
import UserImagePlaceholder from '@/public/images/user-placeholder.png';


export const NavMenuMobile: React.FC = () => {
  const { data: session } = useSession();
  const t = useTranslations('Layout');

  const userImage = session && session.user && session.user.image ? session.user.image : UserImagePlaceholder;

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
                  alt={session?.user?.name!} 
                  width={40} 
                  height={40} 
                  className='rounded-full' 
                />
                <div>
                  <p className='text-foreground text-sm font-semibold'>
                    {session?.user?.name!}
                  </p>
                  <p className='text-secondary-3 text-xs'>
                    {session?.user?.email!}
                  </p>
                </div>
              </div>
              <Separator className='my-3' />
              <MenuLinks isExpanded={true} />
            </div>
            <div className='mb-3 flex flex-col items-center gap-6'>
              {session && session.user && (
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