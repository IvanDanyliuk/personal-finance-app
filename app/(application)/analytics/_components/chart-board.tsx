'use client'

import { DateFilters } from '@/components/data-rendering';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCIES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';


interface IChartBoard {
  data: {
    month: number;
    data: {
      totalIncomes: number;
      totalExpenses: number;
      currency: string;
    }[];
  }[];
  currentCurrency: string;
};


export const ChartBoard: React.FC<IChartBoard> = ({ data, currentCurrency }) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const handelSelectCurrency = (value: string) => {
    setSelectedCurrency(value);
    params.set('currency', value);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const currencyFromSearchParams = params.get('currency');
    setSelectedCurrency(currencyFromSearchParams || currentCurrency);
  }, [currentCurrency]);

  return (
    <div>
      <div>
        <DateFilters />
        <Select value={selectedCurrency} onValueChange={handelSelectCurrency}>
          <SelectTrigger className='w-[180px] h-10 px-5 rounded-full'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent className='bg-background'>
            {CURRENCIES.map(currency => (
              <SelectItem 
                key={crypto.randomUUID()} 
                value={currency.value}
              >
                {t(currency.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        Cash Flow
      </div>
      <div>
        Income dynamic
      </div>
      <div>
        Expenses dynamic
      </div>
      <div>
        Income structure
      </div>
      <div>
        Expenses structure
      </div>
    </div>
  );
};