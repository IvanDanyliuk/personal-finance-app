'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Ellipsis } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IBankAccount } from '@/lib/types/bank';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/helpers';
import Image from 'next/image';
import { PAYMENT_SYSTEMS } from '@/lib/constants';


interface IAccountCardActions {
  account: IBankAccount;
};


export const AccountCardActions: React.FC<IAccountCardActions> = ({ account }) => {
  const t = useTranslations();

  const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [isTransferOpen, setTransferOpen] = useState<boolean>(false);

  console.log('ACCOUNT ACTIONS DATA', account)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Ellipsis className='w-7 h-7' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='p-2 space-y-1 bg-background rounded-xl'>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)} className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
            {t('HomePage.balanceSection.accountCard.detailsMenuItemLabel')}
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
            {t('HomePage.balanceSection.accountCard.transferFundsMenuItemLabel')}
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
          {t('HomePage.balanceSection.accountCard.closeAccountMenuItemLabel')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className='min-w-fit'>
          {account.bank && account.bank.logo && account.cardNumber && account.paymentSystem && (
            <div className='relative w-80 h-44 p-3 flex flex-col justify-between items-center bg-gradient-to-r from-primary-2 via-primary-3 to-primary-2 rounded-xl'>
              <Avatar className='h-10'>
                <AvatarImage src={account!.bank!.logo!} />
              </Avatar>
              <p>
                {formatNumber(account.cardNumber, 4)}
              </p>
              <div>
                <Image 
                  src={PAYMENT_SYSTEMS.find(item => item.value === account.paymentSystem)!.icon!} 
                  alt={account.paymentSystem} 
                  width={7} 
                  height={7}
                />

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};