'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Ellipsis } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { COUNTRIES, PAYMENT_SYSTEMS } from '@/lib/constants';
import { Courier_Prime } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { deleteAccount } from '@/lib/actions/account.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/public/images/tube-spinner.svg';


const cardNumberFont = Courier_Prime({ 
  subsets: ['latin'], 
  weight: '400' 
});

interface IAccountCardActions {
  account: IBankAccount;
};


export const AccountCardActions: React.FC<IAccountCardActions> = ({ account }) => {
  const t = useTranslations();
  const { toast } = useToast();
  const [pending, setTransition] = useTransition();

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
            {t('HomePage.balanceSection.accountCard.transferFundsMenuItemLabel')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className='cursor-pointer px-3 hover:bg-primary-1 rounded-full'>
          {t('HomePage.balanceSection.accountCard.closeAccountMenuItemLabel')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className='min-w-fit flex flex-col items-center'>
          {account.bank && account.bank.logo && account.cardNumber && account.paymentSystem && (
            <>
              <div className='relative w-80 h-44 p-3 flex flex-col justify-center items-center bg-gradient-to-r from-primary-2 via-primary-3 to-primary-2 rounded-xl'>
                <Avatar className='absolute top-3 right-3 h-10'>
                  <AvatarImage src={account!.bank!.logo!} />
                </Avatar>
                <p className={cn(cardNumberFont.className, 'text-2xl text-secondary-5')}>
                  {formatNumber(account.cardNumber, 4)}
                </p>
                <Image 
                  src={PAYMENT_SYSTEMS.find(item => item.value === account.paymentSystem)!.icon!} 
                  alt={account.paymentSystem} 
                  width={42} 
                  height={42}
                  className='absolute left-3 bottom-3'
                />
              </div>
              <Separator />
            </>
          )}
          <div className='w-full space-y-3 text-sm'>
            <h4 className='w-full flex justify-between items-center gap-1 text-base font-semibold'>
              {t(`General.accountTypes.${account.type}`)}
              {account.accountNumber && <p>{`#${account.accountNumber}`}</p>}
            </h4>
            {account.bank && (
              <div className='w-full flex justify-between items-center gap-1'>
                <p>
                  {t('HomePage.balanceSection.accountDetails.bank')}
                </p>
                <p className='font-semibold'>
                  {`${account.bank?.name} (${t(COUNTRIES.find(item => item.value === account.bank?.country)?.label)})`}
                </p>
              </div>
            )}
            <div className='w-full flex justify-between items-center gap-1'>
              <p>
                {t('HomePage.balanceSection.accountDetails.currency')}
              </p>
              <p className='font-semibold'>
                {t(`General.currencies.${account.currency}`)}
              </p>
            </div>
            <div className='w-full flex justify-between items-center gap-1 font-semibold text-primary-7'>
              <p>
                {t('HomePage.balanceSection.accountDetails.balance')}
              </p>
              <p>
                {account.balance}
              </p>
            </div>
            {account.additionalInfo && (
              <div className='w-full flex justify-between items-center gap-1'>
                <p>
                  {t('HomePage.balanceSection.accountDetails.additionalInfo')}
                </p>
                <p>
                  {account.additionalInfo}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className='pt-10'>
          <DialogHeader>
            <DialogTitle className='text-center'>
              {t('HomePage.balanceSection.deleteAccount.submitAccountDeletingTitle')}
            </DialogTitle>
            <DialogDescription className='text-center'>
              {t('HomePage.balanceSection.deleteAccount.submitAccountDeletingMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-row gap-3'>
            <Button 
              type='button' 
              onClick={handleAccountDelete} 
              disabled={pending} 
              className='py-6 flex-1 rounded-full bg-danger-2 hover:bg-danger-1 text-white font-semibold'
            >
              {pending ? (
                <Image 
                  src={Spinner} 
                  alt='Loading' 
                  width={20} 
                  height={20} 
                />
              ) : t('HomePage.balanceSection.deleteAccount.submitBtnLabel')}
            </Button>
            <Button 
              type='button' 
              onClick={() => setDeleteOpen(false)} 
              className='py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
            >
              {t('HomePage.balanceSection.deleteAccount.cancelBtnLabel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};