'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { CheckboxField } from '@/components/inputs/Checkbox';
import FileInput from '@/components/inputs/FileInput';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import { signup } from '@/lib/actions/auth.actions';
import { useState } from 'react';
import { SubmitButton } from '@/components/common/submit-btn';


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

  const handleAgreementConfirm = () => {
    setIsAgreementConfirmed(!isAgreementConfirmed);
  };

  return (
    <form 
      action={formAction} 
      className='w-full flex flex-col justify-center gap-3'
    >
      <TextField 
        label='Name'
        name='name'
        
      />
      <TextField 
        label='Email'
        name='email'
        type='email'
      />
      <TextField 
        label='Password'
        name='password'
        type='password'
      />
      <TextField 
        label='Confirm Password'
        name='confirmPassword'
        type='confirmPassword'
      />
      <FileInput 
        name='image'
      />
      <SubmitButton label='Sign up' />
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