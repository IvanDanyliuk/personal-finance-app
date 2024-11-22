'use client';

import { SubmitButton } from '@/components/common/submit-btn';
import { CheckboxField } from '@/components/inputs/Checkbox';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { useFormState } from 'react-dom';


export const SignInForm = () => {
  // const [] = useFormState()

  return (
    <form 
      action='' 
      className='w-full flex flex-col justify-center gap-3'
    >
      <TextField 
        label='Email'
        name='email'
        
      />
      <TextField 
        label='Password'
        name='password'
        
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
  )
}