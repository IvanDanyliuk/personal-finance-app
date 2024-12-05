'use client'

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '../ui/separator';
import UserImagePlaceholder from '@/public/images/user-placeholder.png';


export const UserMenu: React.FC = () => {
  const t = useTranslations('Layout')
  const { data: session } = useSession();
  const userImage = session && session.user && session.user.image ? 
    session.user.image : 
    UserImagePlaceholder;

  if(!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='pr-0 md:pr-5 flex items-center gap-3 border border-secondary-2 rounded-full'>
          <Image 
            src={userImage} 
            alt={session?.user?.name!} 
            width={40} 
            height={40} 
            className='rounded-full' 
          />
          <div className='hidden md:block'>
            <p className='text-left text-base text-foreground font-semibold'>
              {session?.user?.name!}
            </p>
            <p className='text-left text-xs text-secondary-3'>
              {session?.user?.email!}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-3 md:px-0 py-1 bg-background text-foreground'>
        <div className='block md:hidden'>
          <p className='text-left text-sm text-foreground font-semibold'>
            {session?.user?.name!}
          </p>
          <p className='text-left text-xs text-secondary-3'>
            {session?.user?.email!}
          </p>
        </div>
        <Separator className='block md:hidden mt-2' />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className='mr-1' />
          {t('logoutBtn')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};