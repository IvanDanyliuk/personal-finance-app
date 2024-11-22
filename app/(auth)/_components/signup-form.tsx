'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { CheckboxField } from '@/components/inputs/Checkbox';
import FileInput from '@/components/inputs/FileInput';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import { signup } from '@/lib/actions/user.actions';
import { useState } from 'react';


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
      <Button 
        type='submit' 
        disabled={!isAgreementConfirmed}
        className='w-full py-6 mt-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'
      >
        Sign In
      </Button>
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