'use client';

import { Fragment, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SubmitHandler } from 'react-hook-form';
import { ArrowDownUp } from 'lucide-react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger 
} from '@/components/ui/select';
import { IncomeForm } from '../../app/(application)/incomes/_components';
import { ActionStatus, ColType, SortOrder } from '@/lib/types/common.types';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { ExpenseSchema } from '@/lib/types/form-schemas/expenses';
import { TableRowActionsMenu } from '@/components/common';
import { useToast } from '@/hooks/use-toast';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { generateEmptyState, hasKey } from '@/lib/helpers';
import { ExpenseForm } from '@/app/(application)/expenses/_components';


interface IncomesData extends IncomeSchema {
  id: string;
};

interface ExpenseData extends ExpenseSchema {
  id: string;
};

type IData = IncomesData | ExpenseData;

interface IDataTable {
  status: ActionStatus;
  columns: ColType[];
  data: IData[];
  count: number;
  updateAction: (formData: FormData) => Promise<any>;
  deleteAction: (id: string) => Promise<any>;
  error: string | null;
};

type RowActionData = {
  type: 'update' | 'delete'; 
  item: IData;
};


export const DataTable: React.FC<IDataTable> = ({ 
  status, 
  columns, 
  data, 
  count, 
  updateAction, 
  deleteAction, 
  error 
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [rowActionData, setRowActionData] = useState<RowActionData | null>(null);
  const [pending, setTransition] = useTransition();

  const keys = Object.keys({ ...data[0] }) as (keyof IData)[];
  const emptyRowData = generateEmptyState<IData>(keys);

  const handleSetPrevPage = () => {
    if(currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  const handleDataSort = (sortBy: string) => {
    const currentSortIndicator = params.get('sortBy');
    const currentSortOrder = params.get('order');

    if(currentSortIndicator !== sortBy) {
      params.set('sortBy', sortBy);
      params.set('order', SortOrder.Desc);
    } else {
      if(currentSortOrder === SortOrder.Desc) {
        params.set('order', SortOrder.Asc);
      } else {
        params.set('order', SortOrder.Desc);
      }
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleOpenDialog = (type: 'update' | 'delete', itemId: string) => {
    const item = data.find(dataItem => dataItem.id === itemId)!;
    setConfirmDialogOpen(true);
    setRowActionData({ type, item });
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
    setRowActionData(null)
  };

  const handleSubmitUpdate: SubmitHandler<IData> = async (data) => {
    if(rowActionData) {
      const formData = new FormData();
      formData.append('id', rowActionData.item.id)
      formData.append('userId', data.userId);
      columns.forEach((col) => {
        formData.append(
          col.name, 
          col.name === 'date'
            ? data[col.name].toISOString() 
            : `${data[col.name as keyof IData]}`)
      });
      
      const { status, error } = await updateAction(formData);

      if(status === ActionStatus.Success) {
        toast({
          description: t(
            hasKey<IncomesData>(rowActionData.item, 'source') 
              ? 'IncomesPage.actionMessages.updateIncomeSuccess' 
              : 'ExpensesPage.actionMessages.updateExpenseSuccess'
          ),
          variant: 'default',
          className: 'bg-success-1 text-success-2'
        });
        setConfirmDialogOpen(false);
        setRowActionData(null);
      }

      if(status === ActionStatus.Failed && error) {
        toast({
          title: t('errors.general'),
          description: t(error),
          variant: 'destructive',
          className: 'bg-danger-1 text-danger-2'
        });
      }
    }
  };

  const handleSubmitDelete = () => {
    if(rowActionData) {
      setTransition(() => {
        deleteAction(rowActionData.item.id).then(res => {
          if(res.status === ActionStatus.Success) {
            setConfirmDialogOpen(false);
          }
          toast({
            description: t(('IncomesPage.actionMessages.incomeDeleted')),
            variant: 'default',
            className: 'bg-success-1 text-success-2'
          });
          setRowActionData(null);
        });
      });
    }
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
    <>
      <Table className='w-full border-separate border-spacing-y-3'>
        <TableHeader>
          <TableRow className='text-foreground border-none'>
            {columns.map((col, i) => (
              <TableHead 
                key={crypto.randomUUID()} 
                className={cn(
                  'px-6 py-5 bg-background-normal',
                  i === 0 ? 'w-[100px] rounded-l-full' : ''
                )}
              >
                <div 
                  onClick={col.isSortable ? () => handleDataSort(col.name) : undefined} 
                  className='cursor-pointer flex items-center gap-1'
                >
                  {t(col.label).toUpperCase()}
                  {col.isSortable && (
                    <ArrowDownUp className='w-4 h-4' />
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className='px-6 py-4 bg-background-normal rounded-r-full' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ...data,
            ...Array.from({ length: itemsPerPage - data.length }, () => emptyRowData)
          ].map((dataItem: any) => (
            <Fragment key={crypto.randomUUID()}>
              {dataItem.id ? (
                <TableRow className='text-foreground bg-background hover:bg-background-neutral'>
                  {columns.map((item, i) => (
                    <TableCell 
                      key={crypto.randomUUID()} 
                      className={cn(
                        'px-6 py-2 border-t border-b border-background-neutral',
                        i === 0 ? 'border-l rounded-l-full' : ''
                      )}
                    >
                      {item.name === 'date' 
                        ? format(dataItem.date, 'dd.MM.yyyy') 
                        : item.name === 'amount' || item.name === 'comment' || item.name === 'destination'
                          ? dataItem[item.name]
                          : t(`${item.value ? item.value + '.' : ''}${dataItem[item.name]}`)
                      }
                    </TableCell>
                  ))}
                  <TableCell className='px-6 py-2 border-r border-t border-b border-background-neutral rounded-r-full'>
                    <TableRowActionsMenu 
                      updateBtnLabel={t('Layout.tableRowMenuActionBtns.updateRowMenuItem')}
                      deleteBtnLabel={t('Layout.tableRowMenuActionBtns.deleteRowMenuItem')}
                      onUpdate={() => handleOpenDialog('update', dataItem.id)}
                      onDelete={() => handleOpenDialog('delete', dataItem.id)}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  {Array(columns.length + 1)
                    .fill('')
                    .map(() => (
                      <TableCell 
                        key={crypto.randomUUID()} 
                        className='py-5' 
                      />
                    )
                  )}
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
        <TableFooter className='w-full'>
          <TableRow>
            <TableCell colSpan={columns.length + 1} className='border border-background-neutral rounded-full'>
              <div className='p-3 w-full flex justify-between items-center'>
                <Select onValueChange={handleSetItemsPerPage}>
                  <SelectTrigger className='p-3 w-fit rounded-full'>
                    {t(`General.itemsPerPage.${itemsPerPage}`)}
                  </SelectTrigger>
                  <SelectContent className='w-fit bg-background'>
                    {ITEMS_PER_PAGE.map(({ value, label }) => (
                      <SelectItem key={crypto.randomUUID()} value={value}>
                        {t(label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className='flex gap-3'>
                  <Button 
                    type='button' 
                    disabled={currentPage <= 1} 
                    onClick={handleSetPrevPage}
                    className='min-w-36 bg-primary-7 text-white border-none rounded-full'
                  >
                    {t('Layout.tableNavButtons.prev')}
                  </Button>
                  <Button 
                    type='button' 
                    disabled={currentPage * itemsPerPage >= count} 
                    onClick={handleSetNextPage}
                    className='min-w-36 bg-primary-7 text-white border-none rounded-full'
                  >
                    {t('Layout.tableNavButtons.next')}
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {rowActionData && (
        <Dialog 
          open={isConfirmDialogOpen} 
          onOpenChange={handleDialogClose}
        >
          <DialogContent className='space-y-3'>
            {rowActionData.type === 'update' ? (
              <>
                {hasKey<IncomesData>(rowActionData.item, 'source') && (
                  <>
                    <DialogHeader className='text-lg font-semibold'>
                      {t('IncomesPage.createIncomeForm.titleUpdate')}
                    </DialogHeader>
                    <IncomeForm 
                      incomeToUpdate={rowActionData.item as IncomesData} 
                      action={handleSubmitUpdate} 
                    />
                  </>
                )}
                {hasKey<ExpenseData>(rowActionData.item, 'category') && (
                  <>
                    <DialogHeader className='text-lg font-semibold'>
                      {t('ExpensesPage.createExpenseForm.titleUpdate')}
                    </DialogHeader>
                    <ExpenseForm 
                      expenseToUpdate={rowActionData.item as ExpenseData} 
                      action={handleSubmitUpdate} 
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <DialogHeader className='px-6'>
                  <DialogTitle className='mb-3 text-center'>
                    {t(
                      hasKey<IncomesData>(rowActionData.item, 'source') 
                        ? 'IncomesPage.incomesTable.confirmDeleteTitle' 
                        : 'ExpensesPage.expenseTable.confirmDeleteTitle'
                    )}
                  </DialogTitle>
                  <DialogDescription className='text-center'>
                    {t(
                      hasKey<IncomesData>(rowActionData.item, 'source') 
                        ? 'IncomesPage.incomesTable.confirmDeleteMessage' 
                        : 'ExpensesPage.expenseTable.confirmDeleteMessage'
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex flex-row gap-3'>
                  <Button 
                    type='button' 
                    onClick={handleSubmitDelete} 
                    disabled={pending || !rowActionData.item.id} 
                    className='py-6 flex-1 rounded-full bg-danger-2 hover:bg-danger-1 text-white font-semibold'
                  >
                    {t('Layout.submitBtnLabel')}
                  </Button>
                  <Button 
                    type='button' 
                    onClick={handleDialogClose} 
                    className='py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
                  >
                    {t('Layout.cancelBtnLabel')}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};