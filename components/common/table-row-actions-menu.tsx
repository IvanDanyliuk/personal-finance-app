'use client';

import { useState, useTransition } from 'react';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ActionStatus } from '@/lib/types/common.types';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';


type ActionResponse = {
  status: ActionStatus,
  error: string | null,
};

interface ITableRowActionsMenu {
  actionId: string;
  updateBtnLabel: string;
  deleteBtnLabel: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  updateAction: () => Promise<ActionResponse>;
  deleteAction: (id: string) => Promise<ActionResponse>;
};


export const TableRowActionsMenu: React.FC<ITableRowActionsMenu> = ({
  actionId,
  updateBtnLabel,
  deleteBtnLabel,
  confirmDeleteTitle,
  confirmDeleteMessage,
  updateAction,
  deleteAction
}) => {
  const { toast } = useToast();
  const t = useTranslations();

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [pending, setTransition] = useTransition();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialogOpen(true);
  };

  const handleDialogClose = () => setConfirmDialogOpen(false);

  const handleSubmitDeleting = () => {
    setTransition(() => {
      deleteAction(actionId).then(res => {
        if(res.status === ActionStatus.Success) {
          setConfirmDialogOpen(false);
        }
        toast({
          description: t(('IncomesPage.actionMessages.incomeDeleted')),
          variant: 'default',
          className: 'bg-success-1 text-success-2'
        });
      });
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='w-full flex justify-end'>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-background text-foreground'>
          <DropdownMenuItem onClick={updateAction} className='flex items-center gap-1 text-sm'>
            <Pencil className='w-5 h-5' />
            {updateBtnLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick}>
            <Trash className='w-5 h-5' />
            {deleteBtnLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDeleteTitle}
            </DialogTitle>
            <DialogDescription>
              {confirmDeleteMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-row gap-3'>
            <Button 
              type='button' 
              onClick={handleSubmitDeleting} 
              disabled={pending} 
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
        </DialogContent>
      </Dialog>
    </>
  );
};