'use client';

import { MouseEventHandler } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Spinner from '@/public/images/tube-spinner.svg';


interface IDeleteAccountDialog {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pending: boolean;
  deleteAction: MouseEventHandler<HTMLButtonElement>;
};


export const DeleteAccountDialog: React.FC<IDeleteAccountDialog> = ({
  open, 
  onOpenChange,
  pending, 
  deleteAction
}) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={deleteAction} 
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
            onClick={() => onOpenChange(false)} 
            className='py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
          >
            {t('HomePage.balanceSection.deleteAccount.cancelBtnLabel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};