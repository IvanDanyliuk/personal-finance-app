'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common/submit-btn';
import { CheckboxField, TextField } from '@/components/inputs';
import { useToast } from "@/hooks/use-toast"
import { signin } from '@/lib/actions/auth.actions';


const initialState = {
  email: '',
  password: ''
};


export const SignInForm = () => {
  const [state, formAction] = useFormState<any, any>(signin, initialState);
  const { toast } = useToast();
  const t = useTranslations('Auth');

  useEffect(() => {
    if(state.error) {
      toast({
        title: t('errors.general.title'),
        description: t(state.error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  }, [state, formAction]);

  return (
    <form 
      action={formAction} 
      className='w-full flex flex-col justify-center gap-3'
    >
      <TextField 
        label={t('signinPage.email')}
        name='email'
        error={state && state.fieldError && state.fieldError['email']}
      />
      <TextField 
        label={t('signinPage.password')}
        name='password'
        type='password'
        error={state && state.fieldError && state.fieldError['password']}
      />
      <SubmitButton>
        {t('signinPage.signinBtn')}
      </SubmitButton>
      <div className='py-3 w-full flex justify-between items-center'>
        <CheckboxField 
          name='rememberMe'
          label={t('signinPage.rememberMeCheckboxLabel')}
        />
        <Link 
          href='/' 
          className='text-sm text-primary-8 font-semibold'
        >
          {t('signinPage.forgotPasswordLinkLabel')}
        </Link>
      </div>
    </form>
  );
};