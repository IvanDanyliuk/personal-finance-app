'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
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


interface IManagePersonalData {
  variant: 'name' | 'email';
  currentUserName?: string;
  currentUserEmail?: string;
};


export const ManagePersonalData: React.FC<IManagePersonalData> = ({ variant, currentUserName, currentUserEmail }) => {
  const t = useTranslations('SettingsPage.managePersonalData');
  const { toast } = useToast();

  const [state, formAction] = useFormState<any, any>(updateUserData, { name: '', email: '' });

  useEffect(() => {
    if(state && state.error) {
      toast({
        title: t('errors.general.title'),
        description: t(state.error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  }, [state, formAction]);

  return (
    <div className='w-full flex justify-between items-center'>
      <p className='font-semibold'>
        {t(variant === 'name' ? 'editNameFormLabel' : 'editEmailFormLabel')}
      </p>
      <div className='md:min-w-[400px] flex justify-between items-center gap-3'>
        <p className='font-semibold'>
          {variant === 'name' ? currentUserName : currentUserEmail}
        </p>
        <Dialog>
          <DialogTrigger className='p-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white'>
            <Pencil className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent className='py-6'>
            <DialogHeader>
              <DialogTitle>
                {t(variant === 'name' ? 'updateNameFormTitle' : 'updateEmailFormTitle')}
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
                  {t('submitBtnLabel')}
                </SubmitButton>
                <Button className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'>
                  {t('cancelBtnLabel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};