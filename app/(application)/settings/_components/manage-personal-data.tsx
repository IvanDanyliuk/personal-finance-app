'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/common/submit-btn';
import { updateUserData } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import { ActionStatus } from '@/lib/types/common.types';


interface IManagePersonalData {
  variant: 'name' | 'email';
  currentUserName?: string;
  currentUserEmail?: string;
};


export const ManagePersonalData: React.FC<IManagePersonalData> = ({ variant, currentUserName, currentUserEmail }) => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();
  const { update } = useSession();

  const [state, formAction] = useFormState<any, any>(updateUserData, { name: '', email: '' });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFormOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if(state && state.status === ActionStatus.Success && state.updatedName) {
      update({ name: state.updatedName }).then(res => toast({
        description: t('actionMessages.userNameUpdated'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      }));
      setIsOpen(false);
    }

    if(state && state.status === ActionStatus.Success && state.updatedEmail) {
      update({ email: state.updatedEmail }).then(res => toast({
        description: t('actionMessages.userEmailUpdated'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      }));
      setIsOpen(false);
    }

    if(state && state.status === ActionStatus.Failed && state.error) {
      toast({
        title: t('errors.general'),
        description: t(state.error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  }, [state, formAction]);

  return (
    <div className='w-full flex justify-between items-center'>
      <p className='font-semibold'>
        {t(variant === 'name' ? 'managePersonalData.editNameFormLabel' : 'managePersonalData.editEmailFormLabel')}
      </p>
      <div className='md:min-w-[400px] flex justify-between items-center gap-3'>
        <p className='font-semibold'>
          {variant === 'name' ? currentUserName : currentUserEmail}
        </p>
        <Dialog open={isOpen} onOpenChange={handleFormOpen}>
          <DialogTrigger className='p-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white'>
            <Pencil className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent className='py-6'>
            <DialogHeader>
              <DialogTitle>
                {t(variant === 'name' ? 'managePersonalData.updateNameFormTitle' : 'managePersonalData.updateEmailFormTitle')}
              </DialogTitle>
            </DialogHeader>
            <form action={formAction}>
              <TextField 
                name={variant === 'name' ? 'name' : 'email'} 
                type={variant === 'email' ? 'email' : 'text'} 
                placeholder={variant === 'name' ? currentUserName : currentUserEmail} 
              />
              <div className='flex gap-3'>
                <SubmitButton>
                  {t('managePersonalData.submitBtnLabel')}
                </SubmitButton>
                <Button 
                  type='button' 
                  onClick={handleFormOpen} 
                  className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'
                >
                  {t('managePersonalData.cancelBtnLabel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};