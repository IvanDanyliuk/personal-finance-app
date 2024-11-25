'use client'

import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '../ui/separator';


interface IUserMenu {
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
};


export const UserMenu: React.FC<IUserMenu> = ({ userId, name, email, imageUrl }) => {
  console.log(userId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='pr-0 md:pr-5 flex items-center gap-3 border border-secondary-2 rounded-full'>
          <Image src={imageUrl} alt={name} width={40} height={40} className='rounded-full' />
          <div className='hidden md:block'>
            <p className='text-left text-base text-foreground font-semibold'>
              {name}
            </p>
            <p className='text-left text-xs text-secondary-3'>
              {email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-3 md:px-0 py-1 bg-background text-foreground'>
        <div className='block md:hidden'>
          <p className='text-left text-sm text-foreground font-semibold'>
            {name}
          </p>
          <p className='text-left text-xs text-secondary-3'>
            {email}
          </p>
        </div>
        <Separator className='mt-2' />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className='mr-1' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};