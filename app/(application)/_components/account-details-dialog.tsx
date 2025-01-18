'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Courier_Prime } from 'next/font/google';
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import { COUNTRIES, PAYMENT_SYSTEMS } from '@/lib/constants';
import { formatNumber } from '@/lib/helpers';
import { IBankAccount } from '@/lib/types/bank';
import { cn } from '@/lib/utils'


const cardNumberFont = Courier_Prime({ 
  subsets: ['latin'], 
  weight: '400' 
});

interface IAccountDetailsDialog {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: IBankAccount;
};


export const AccountDetailsDialog: React.FC<IAccountDetailsDialog> = ({
  open, 
  onOpenChange, 
  data
}) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-fit flex flex-col items-center'>
        {data.bank && data.bank.logo && data.cardNumber && data.paymentSystem && (
          <>
            <div className='relative w-80 h-44 p-3 flex flex-col justify-center items-center bg-gradient-to-r from-primary-2 via-primary-3 to-primary-2 rounded-xl'>
              <Avatar className='absolute top-3 right-3 h-10'>
                <AvatarImage src={data!.bank!.logo!} />
              </Avatar>
              <p className={cn(cardNumberFont.className, 'text-2xl text-secondary-5')}>
                {formatNumber(data.cardNumber, 4)}
              </p>
              <Image 
                src={PAYMENT_SYSTEMS.find(item => item.value === data.paymentSystem)!.icon!} 
                alt={data.paymentSystem} 
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
            {t(`General.accountTypes.${data.type}`)}
            {data.accountNumber && <p>{`#${data.accountNumber}`}</p>}
          </h4>
          {data.bank && (
            <div className='w-full flex justify-between items-center gap-1'>
              <p>
                {t('HomePage.balanceSection.accountDetails.bank')}
              </p>
              <p className='font-semibold'>
                {`${data.bank?.name} (${t(COUNTRIES.find(item => item.value === data.bank?.country)?.label)})`}
              </p>
            </div>
          )}
          <div className='w-full flex justify-between items-center gap-1'>
            <p>
              {t('HomePage.balanceSection.accountDetails.currency')}
            </p>
            <p className='font-semibold'>
              {t(`General.currencies.${data.currency}`)}
            </p>
          </div>
          <div className='w-full flex justify-between items-center gap-1 font-semibold text-primary-7'>
            <p>
              {t('HomePage.balanceSection.accountDetails.balance')}
            </p>
            <p>
              {data.balance}
            </p>
          </div>
          {data.additionalInfo && (
            <div className='w-full flex justify-between items-center gap-1'>
              <p>
                {t('HomePage.balanceSection.accountDetails.additionalInfo')}
              </p>
              <p>
                {data.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}