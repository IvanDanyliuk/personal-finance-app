'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common';
import { CheckboxField, TextField } from '@/components/inputs';
import { useToast } from "@/hooks/use-toast"
import { signin } from '@/lib/actions/auth.actions';
import { signInSchema, SignInSchema } from '@/lib/types/form-schemas/auth';
import { ActionStatus } from '@/lib/types/common.types';


export const SignInForm = () => {
  const { toast } = useToast();
  const t = useTranslations('Auth');
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const onSubmitForm: SubmitHandler<SignInSchema> = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    const { status, error } = await signin(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('actionMessages.signInSuccess'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      router.push('/');
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('errors.general.title'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Controller 
        name='email'
        control={control}
        render={({ field }) => (
          <TextField 
            name='email' 
            label={t('signinPage.email')} 
            field={field}
            error={errors['email']?.message} 
          />
        )}
      />
      <Controller 
        name='password'
        control={control}
        render={({ field }) => (
          <TextField 
            name='password' 
            label={t('signinPage.password')} 
            type='password'
            field={field}
            error={errors['password']?.message} 
          />
        )}
      />
      <SubmitButton isSubmitting={isSubmitting}>
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