'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common/submit-btn';
import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';


export const ManagePassword: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, formAction] = useFormState<any, any>(updatePassword, {});

  const handleDialogOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if(state && state.status === ActionStatus.Success) {
      toast({
        description: t('actionMessages.passwordUpdated'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      setIsOpen(false);
    }

    if(state && state.status === ActionStatus.Failed && state.error) {
      toast({
        description: t(state.error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  }, [state, formAction]);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger className='px-7 py-3 w-fit bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'>
        {t('managePassword.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <TextField 
            name='currentPassword' 
            type='password' 
            label={t('managePassword.currentPasswordLabel')} 
            error={state && state.fieldError && state.fieldError['currentPassword']} 
          />
          <TextField 
            name='newPassword' 
            type='password' 
            label={t('managePassword.newPasswordLabel')} 
            error={state && state.fieldError && state.fieldError['newPassword']} 
          />
          <TextField 
            name='confirmNewPassword' 
            type='password' 
            label={t('managePassword.confirmNewPasswordLabel')} 
            error={state && state.fieldError && state.fieldError['confirmNewPassword']} 
          />
          <div className='flex gap-3'>
            <SubmitButton>
              {t('managePassword.submitBtnLabel')}
            </SubmitButton>
            <Button 
              type='button' 
              onClick={handleDialogOpen} 
              className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'
            >
              {t('managePassword.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};