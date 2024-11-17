'use client'

import Image from 'next/image';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import { signInWithProvider } from '@/lib/actions/user.action';
import GoogleIcon from '../../../public/images/google.svg';


export default function SignInPage() {
  const signInWithGoogle = async () => {
    await signInWithProvider('google');
  };

  return (
    <div className='relative w-full h-screen flex'>
      <div className='w-1/2 h-full flex flex-col justify-center items-center bg-background'>
        <div>
          <h1 className='text-center text-3xl text-foreground font-semibold'>
            Sign In
          </h1>
          <p className='text-center text-xl text-foreground'>
            Hi! Sign in to your account to continue using an application, please.
          </p>
        </div>
        <form 
          action='' 
          className='w-full md:w-[500px] flex flex-col justify-center gap-3 border'
        >
          <TextField 
            label='Email'
            name='name'
            
          />

          <Button 
            type='submit' 
            className='w-full py-6 bg-primary-7 rounded-full text-white'
          >
            Sign In
          </Button>
        </form>
        <Button 
          type='button'
          onClick={signInWithGoogle}
        >
          <Image 
            src={GoogleIcon} 
            alt='Google' 
            width={20} 
            height={20} 
          />
          <span>Sign with Google</span>
        </Button>
      </div>
      <div className='w-1/2 h-full bg-slate-400'>

      </div>
    </div>
  )
}