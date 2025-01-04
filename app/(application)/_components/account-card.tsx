'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AccountType, IBankAccount } from '@/lib/types/bank';
import { Avatar, AvatarImage } from '@/components/ui/avatar';


interface IAccountCard {
  data: IBankAccount;
};


export const AccountCard: React.FC<IAccountCard> = ({ data }) => {
  const t = useTranslations();

  return (
    <div className='relative p-4 min-w-80 h-44 bg-background-secondary rounded-xl'>
      <div className='w-full space-y-5'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-semibold'>
            {t(`General.currencies.${data.currency}`)}
          </p>
          {data.type === AccountType.BankAccount && data.bankId && data.bank ? (
            <TooltipProvider key={crypto.randomUUID()}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className='h-10'>
                    <AvatarImage src={data.bank.logo} />
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className='px-3 py-1 bg-primary-7 text-white rounded-full'>
                  <p>
                    {data.bank.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className='px-3 h-10 flex items-center bg-primary-7 text-white text-sm font-semibold rounded-full'>
              <p>
                {t('HomePage.balanceSection.tabs.cashCardTitle')}
              </p>
            </div>
          )}
        </div>
        <p className='text-5xl font-bold text-primary-7'>
          {data.balance}
        </p>
      </div>
    </div>
  );
};