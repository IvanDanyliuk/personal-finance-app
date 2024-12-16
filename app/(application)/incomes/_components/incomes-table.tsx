'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActionStatus } from '@/lib/types/common.types';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { TableRowActionsMenu } from '@/components/common';
import { deleteIncome, updateIncome } from '@/lib/actions/income.actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ITEMS_PER_PAGE } from '@/lib/constants';


interface IncomesData extends IncomeSchema {
  id: string;
};

interface IIncomesTable {
  status: ActionStatus;
  data: IncomesData[];
  count: number;
  error: string | null;
};


export const IncomesTable: React.FC<IIncomesTable> = ({ status, data, count, error }) => {
  const t = useTranslations();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const handleSetPrevPage = () => {
    if(currentPage > 1) {
      setCurrentPage(currentPage -1);
      params.set('page', `${currentPage - 1}`);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleSetNextPage = () => {
    if(currentPage < Math.ceil(count / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
      params.set('page', `${currentPage + 1}`);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleSetItemsPerPage = (value: string) => {
    setItemsPerPage(+value);
    setCurrentPage(1);
    params.set('items', value);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('errors.general'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }

    const page = searchParams.get('page');

    if(!page) {
      setCurrentPage(1);
      setItemsPerPage(10);
      params.set('page', '1');
      params.set('items', '10');
      replace(`${pathname}?${params.toString()}`);
    } else {
      setCurrentPage(+page);
    }
  }, []);

  return (
    <Table className='w-full border-separate border-spacing-y-3'>
      <TableHeader>
        <TableRow className='text-foreground border-none'>
          <TableHead className='w-[100px] px-6 py-5 bg-background-secondary rounded-l-full'>
            {t('IncomesPage.incomesTable.dateColLabel').toUpperCase()}
          </TableHead>
          <TableHead className='px-6 py-4 bg-background-secondary'>
            {t('IncomesPage.incomesTable.amountColLabel').toUpperCase()}
          </TableHead>
          <TableHead className='px-6 py-4 bg-background-secondary'>
            {t('IncomesPage.incomesTable.currencyColLabel').toUpperCase()}
          </TableHead>
          <TableHead className='px-6 py-4 bg-background-secondary'>
            {t('IncomesPage.incomesTable.sourceColLabel').toUpperCase()}
          </TableHead>
          <TableHead className='px-6 py-4 bg-background-secondary'>
            {t('IncomesPage.incomesTable.commentColLabel').toUpperCase()}
          </TableHead>
          <TableHead className='px-6 py-4 bg-background-secondary rounded-r-full' />
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ...data,
          ...Array.from({ length: itemsPerPage - data.length }, (_, i) => ({
            id: '',
            source: '',
            userId: '',
            date: '',
            amount: '',
            currency: '',
            comment: ''
          }))
        ].map(incomeItem => (
          <>
            {incomeItem.id ? (
              <TableRow key={crypto.randomUUID()} className='text-foreground bg-background hover:bg-background-neutral'>
                <TableCell className='px-6 py-3 border-l border-t border-b border-background-neutral rounded-l-full'>
                  {format(incomeItem.date, 'dd.MM.yyyy')}
                </TableCell>
                <TableCell className='px-6 py-3 border-t border-b border-background-neutral'>
                  {incomeItem.amount}
                </TableCell>
                <TableCell className='px-6 py-3 border-t border-b border-background-neutral'>
                  {t(`General.currencies.${incomeItem.currency}`)}
                </TableCell>
                <TableCell className='px-6 py-3 border-t border-b border-background-neutral'>
                  {t(`IncomesPage.income_sources.${incomeItem.source}`)}
                </TableCell>
                <TableCell className='px-6 py-3 border-t border-b border-background-neutral'>
                  {incomeItem.comment || ''}
                </TableCell>
                <TableCell className='px-6 py-3 border-r border-t border-b border-background-neutral rounded-r-full'>
                  <TableRowActionsMenu 
                    actionId={incomeItem.id}
                    updateBtnLabel='Update'
                    deleteBtnLabel='Delete'
                    confirmDeleteTitle='Are you sure you want to delete this income item?'
                    confirmDeleteMessage='It will be impossible to undo this action.'
                    updateAction={updateIncome}
                    deleteAction={deleteIncome}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={crypto.randomUUID()}>
                <TableCell className='py-6' />
                <TableCell className='py-6' />
                <TableCell className='py-6' />
                <TableCell className='py-6' />
                <TableCell className='py-6' />
                <TableCell className='py-6' />
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
      <TableFooter className='w-full'>
        <TableRow>
          <TableCell colSpan={6} className='border border-background-neutral rounded-full'>
            <div className='px-3 py-5 w-full flex justify-between items-center'>
              <Select onValueChange={handleSetItemsPerPage}>
                <SelectTrigger className='p-3 w-fit rounded-full'>
                  {t(`General.itemsPerPage.${itemsPerPage}`)}
                </SelectTrigger>
                <SelectContent className='w-fit bg-background-secondary'>
                  {ITEMS_PER_PAGE.map(({ value, label }) => (
                    <SelectItem key={crypto.randomUUID()} value={value}>
                      {t(label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <Button 
                  type='button' 
                  disabled={currentPage <= 1} 
                  onClick={handleSetPrevPage}
                >
                  Prev
                </Button>
                <Button 
                  type='button' 
                  disabled={currentPage * itemsPerPage >= count} 
                  onClick={handleSetNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};