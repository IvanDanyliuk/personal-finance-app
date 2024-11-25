'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { CheckboxField, FileInput, TextField} from '@/components/inputs';
import { SubmitButton } from '@/components/common/submit-btn';
import { signup } from '@/lib/actions/auth.actions';
import { useToast } from '@/hooks/use-toast';


const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  image: ''
};


export const SignUpForm = () => {
  const [state, formAction] = useFormState<any, any>(signup, initialState);
  const [isAgreementConfirmed, setIsAgreementConfirmed] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAgreementConfirm = () => {
    setIsAgreementConfirmed(!isAgreementConfirmed);
  };

  useEffect(() => {
    console.log('SIGN IN STATE', state)
    if(state && state.error) {
      toast({
        title: 'Oops! Something wet wrong!',
        description: state.error,
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
        label='Name'
        name='name'
        error={state && state.fieldError && state.fieldError['name']}
      />
      <TextField 
        label='Email'
        name='email'
        type='email'
        error={state && state.fieldError && state.fieldError['email']}
      />
      <TextField 
        label='Password'
        name='password'
        type='password'
        error={state && state.fieldError && state.fieldError['password']}
      />
      <TextField 
        label='Confirm Password'
        name='confirmPassword'
        type='password'
        error={state && state.fieldError && state.fieldError['confirmPassword']}
      />
      <FileInput 
        name='image'
      />
      <SubmitButton 
        label='Sign up' 
        disabled={!isAgreementConfirmed} 
      />
      <div className='py-3 w-full flex justify-start items-center gap-1'>
        <CheckboxField 
          name='agreement'
          label='I agree with'
          checked={isAgreementConfirmed}
          onChange={handleAgreementConfirm}
        />
        <Link 
          href='/privacy-policy' 
          className='text-sm text-primary-8 font-semibold'
        >
          Terms & Privacy
        </Link>
      </div>
    </form>
  );
};