'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { SubmitButton } from '@/components/common/submit-btn';
import { CheckboxField } from '@/components/inputs/Checkbox';
import { TextField } from '@/components/inputs/TextField';
import { useToast } from "@/hooks/use-toast"
import { signin } from '@/lib/actions/auth.actions';


const initialState = {
  email: '',
  password: ''
};

export const SignInForm = () => {
  const [state, formAction] = useFormState<any, any>(signin, initialState);
  const { toast } = useToast()

  useEffect(() => {
    if(state.error) {
      toast({
        title: 'Oops! Something wet wrong!',
        description: state.error
      });
    }
  }, [state, formAction]);

  return (
    <form 
      action={formAction} 
      className='w-full flex flex-col justify-center gap-3'
    >
      <TextField 
        label='Email'
        name='email'
        error={state && state.fieldError && state.fieldError['email']}
      />
      <TextField 
        label='Password'
        name='password'
        error={state && state.fieldError && state.fieldError['password']}
      />
      <SubmitButton label='Sign in' />
      <div className='py-3 w-full flex justify-between items-center'>
        <CheckboxField 
          name='rememberMe'
          label='Keep me logged in'
        />
        <Link 
          href='/' 
          className='text-sm text-primary-8 font-semibold'
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
};