'use client';

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
import { useFormState } from 'react-dom';
import { updateUserData } from '@/lib/actions/user.actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


interface IManagePersonalData {
  variant: 'name' | 'email';
  currentUserName?: string;
  currentUserEmail?: string;
};


export const ManagePersonalData: React.FC<IManagePersonalData> = ({ variant, currentUserName, currentUserEmail }) => {
  const t = useTranslations('SettingsPage.managePersonalData');
  const { toast } = useToast();

  const [state, formAction] = useFormState<any, any>(updateUserData, {});

  useEffect(() => {
    if(state.error) {
      toast({
        title: 'Oops! Something wet wrong!',
        description: state.error,
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  }, [state, formAction]);

  return (
    <div className='w-full flex justify-between items-center'>
      <p>
        {t(variant === 'name' ? 'editNameFormLabel' : 'editEmailFormLabel')}
      </p>
      <Dialog>
        <DialogTrigger>
          <Pencil />
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
              <Button className='py-6 mt-3 w-full rounded-full'>
                {t('cancelBtnLabel')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};