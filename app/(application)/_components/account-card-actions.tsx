'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';



interface IAccountCardActions {
  accountId: string;
}


export const AccountCardActions: React.FC<IAccountCardActions> = ({ accountId }) => {
  const t = useTranslations();

  const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [isTransferOpen, setTransferOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};