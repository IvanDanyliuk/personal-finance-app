'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CheckboxField, FileInput, TextField } from '@/components/inputs';
import { SubmitButton } from '@/components/common/submit-btn';
import { signup } from '@/lib/actions/auth.actions';
import { signUpSchema, SignUpSchema } from '@/lib/types/form-schemas/auth';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';


export const SignUpForm = () => {
  const [isAgreementConfirmed, setIsAgreementConfirmed] = useState<boolean>(false);
  const { toast } = useToast();
  const t = useTranslations('Auth');
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', image: '' },
  });

  const {
    register,
    handleSubmit,
    setValue, 
    formState: { errors, isSubmitting }
  } = form;

  const onSubmitForm: SubmitHandler<SignUpSchema> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('image', data.image);

    const { status, error } = await signup(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('actionMessages.signUpSuccess'),
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
  }

  const handleAgreementConfirm = () => {
    setIsAgreementConfirmed(!isAgreementConfirmed);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <TextField 
        name='name' 
        label={t('signupPage.name')} 
        register={register} 
        error={errors['name']?.message} 
      />
      <TextField 
        name='email' 
        label={t('signupPage.email')} 
        register={register} 
        error={errors['email']?.message} 
      />
      <TextField 
        name='password' 
        label={t('signupPage.password')} 
        type='password'
        register={register} 
        error={errors['password']?.message} 
      />
      <TextField 
        name='confirmPassword' 
        label={t('signupPage.confirmPassword')} 
        type='password'
        register={register} 
        error={errors['confirmPassword']?.message} 
      />
      <FileInput 
        name='image'
        register={register}
        setValue={setValue}
        btnTitle={t('signupPage.image')}
      />
      <SubmitButton 
        disabled={!isAgreementConfirmed} 
        isSubmitting={isSubmitting}
      >
        {t('signupPage.signupBtn')}
      </SubmitButton>
        <div className='py-3 w-full flex justify-start items-center gap-1'>
        <CheckboxField 
          // name='agreement'
          label={t('agreeText')}
          checked={isAgreementConfirmed}
          onChange={handleAgreementConfirm}
        />
        <Link 
          href='/privacy-policy' 
          className='text-sm text-primary-8 font-semibold'
        >
          {t('termsAndPrivacyLink')}
        </Link>
      </div>
    </form>
  );
};