'use client';

import { ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '../ui/button';


interface IConfirmDialog {
  triggerBtnLabel: string;
  title: string;
  message: string;
  action: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export const ConfirmDialog: React.FC<IConfirmDialog> = ({
  triggerBtnLabel,
  title,
  message,
  action,
  disabled = false,
  children
}) => {
  const t = useTranslations('');

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setIsOpen(!isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger className='px-7 py-3 rounded-full bg-danger-2 hover:bg-danger-1 text-white hover:text-danger-2 border border-danger-2 font-semibold'>
        {t(triggerBtnLabel)}
      </DialogTrigger>
      <DialogContent className='pt-10'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            {t(title)}
          </DialogTitle>
          <DialogDescription className='text-center'>
            {t(message)}
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className='flex gap-3'>
          <Button 
            type='button' 
            onClick={action} 
            disabled={disabled} 
            className='py-6 flex-1 rounded-full bg-danger-2 hover:bg-danger-1 text-white font-semibold'
          >
            {t('Layout.submitBtnLabel')}
          </Button>
          <Button 
            type='button' 
            onClick={handleDialogOpen} 
            className='py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
          >
            {t('Layout.cancelBtnLabel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}