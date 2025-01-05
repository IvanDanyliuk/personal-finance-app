'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { AccountType, IBank, IBankAccount } from '@/lib/types/bank';
import { AccountCard, AccountForm } from './';
import { useEffect, useState } from 'react';
import { groupFundsByCurrency } from '@/lib/helpers';


interface IBalanceSection {
  banks: IBank[];
  funds: IBankAccount[];
};


export const BalanceSection: React.FC<IBalanceSection> = ({ banks, funds }) => {
  const t = useTranslations();

  const [totalFunds, setTotalFunds] = useState(null);

  const bankOptions = banks.map(bank => ({ value: bank.id, label: bank.name, icon: bank.logo }));
  const bankAccounts = funds.filter(item => item.type === AccountType.BankAccount);
  const jugs = funds.filter(item => item.type === AccountType.Jug);

  useEffect(() => {
    const groupedFunds = groupFundsByCurrency(funds);
    setTotalFunds(groupedFunds);
  }, [funds]);

  return (
    <div className='max-w-full space-y-3'>
      <div className='w-full flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>
          {t('HomePage.balanceSection.totalFunds.title')}
        </h2>
        <AccountForm banks={bankOptions} />
      </div>
      <div className='flex max-w-full gap-3'>
        <div className='px-4 py-3 w-80 bg-background-secondary rounded-xl space-y-2'>
          <h3 className='text-lg font-semibold text-primary-7'>
            Total
          </h3>
          {totalFunds && (
            <ul>
              {Object.entries(totalFunds).map(item => (
                <li key={crypto.randomUUID()} className='flex justify-between'>
                  <span className='text-primary-8 font-semibold'>
                    {t(`General.currencies.${item[0]}`)}
                  </span>
                  <span className='text-xl text-primary-7 font-bold'>
                    {`${item[1]}`}
                  </span>
                </li>
              ))}
          </ul>
          )}
        </div>
        <div className='px-3 flex-1 overflow-hidden'>
          <Tabs defaultValue='all'>
            <TabsList className='mb-3 flex gap-6'>
              <TabsTrigger value='all' className='flex items-center gap-1'>
                {t('HomePage.balanceSection.tabs.allTabLabel')}
              </TabsTrigger>
              <TabsTrigger value='bank_accounts' className='flex items-center gap-1'>
                {`${t('HomePage.balanceSection.tabs.bankAccountsTabLabel')} (${bankAccounts.length})`}
              </TabsTrigger>
              <TabsTrigger value='jugs' className='flex items-center gap-1'>
                {`${t('HomePage.balanceSection.tabs.jugsTabLabel')} (${jugs.length})`}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
              <div className='flex overflow-x-auto gap-4 py-2 scroll-smooth'>
                {funds.map(item => (
                  <AccountCard 
                    key={crypto.randomUUID()} 
                    data={item} 
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value='bank_accounts'>
              <div className='flex overflow-x-auto gap-4 py-2 scroll-smooth'>
                {bankAccounts.map(item => (
                  <AccountCard 
                    key={crypto.randomUUID()} 
                    data={item} 
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value='jugs'>
              <div className='flex overflow-x-auto gap-4 py-2 scroll-smooth'>
                {jugs.map(item => (
                  <AccountCard 
                    key={crypto.randomUUID()} 
                    data={item} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};