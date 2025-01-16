'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IBankAccount } from '@/lib/types/bank';
import { deleteAccount } from '@/lib/actions/account.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';
import { TransferFundsDialog } from './transfer-funds-dialog';
import { AccountDetailsDialog } from './account-details-dialog';
import { DeleteAccountDialog } from './delete-account-dialog';


interface IAccountCardActions {
  account: IBankAccount;
};


export const AccountCardActions: React.FC<IAccountCardActions> = ({ account }) => {
  const t = useTranslations();
  const { toast } = useToast();
  const [pending, setTransition] = useTransition();

  const bankAccounts = useBankAccountsStore(state => state.accounts);
  const availableToTransferBankAccounts = bankAccounts.filter(item => item.currency === account.currency);

  const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [isTransferOpen, setTransferOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);

  const handleAccountDelete = async () => {
    setTransition(() => {
      deleteAccount(account.id).then(res => {
        const { status, error } = res;

        if(status === ActionStatus.Success && !error) {
          toast({
            description: t('HomePage.actionMessages.deleteAccountSuccess'),
            variant: 'default',
            className: 'bg-success-1 text-success-2'
          });
          setDeleteOpen(false);
        }
    
        if(status === ActionStatus.Failed && error) {
          toast({
            title: t('HomePage.errors.deleteAccount.deleteAccountFailed'),
            description: t(error),
            variant: 'destructive',
            className: 'bg-danger-1 text-danger-2'
          });
        }
      })
    });
  };

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
            {t('HomePage.balanceSection.accountCard.replenishAccountMenuItemLabel')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTransferOpen(true)} className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
            {t('HomePage.balanceSection.accountCard.transferFundsMenuItemLabel')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
          {t('HomePage.balanceSection.accountCard.closeAccountMenuItemLabel')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountDetailsDialog 
        open={isDetailsOpen}
        onOpenChange={setDetailsOpen}
        data={account}
      />

      <TransferFundsDialog 
        open={isTransferOpen} 
        onOpenChange={setTransferOpen} 
        bankAccounts={availableToTransferBankAccounts} 
        // currentBalance={account.balance}
        currentAccountId={account.id}
        currency={account.currency}
      />

      <DeleteAccountDialog 
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        pending={pending}
        deleteAction={handleAccountDelete}
      />
    </>
  );
};