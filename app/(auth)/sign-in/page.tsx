import Link from 'next/link';
import GoogleIcon from '../../../public/images/google.svg';
import { Separator } from '@/components/ui/separator';
import { SignInForm, SignInWithProvider } from '../_components';


export default function SignInPage() {
  

  return (
    <div className='relative w-full h-screen flex'>
      <div className='px-6 md:px-72 w-1/2 h-full flex flex-col justify-center items-center gap-8 bg-background'>
        <div>
          <h1 className='text-center text-3xl text-foreground font-semibold'>
            Sign In
          </h1>
          <p className='text-center text-lg text-foreground'>
            Hi! Please, sign in to your account to continue using an application.
          </p>
        </div>
        <SignInForm />
        <div className='w-full flex items-center gap-3'>
          <Separator className='flex-1' />
          <p className='text-foreground text-sm'>
            or continue with
          </p>
          <Separator className='flex-1' />
        </div>
        <SignInWithProvider 
          tooltipLabel='Sign in with Google'
          tooltipSide='bottom'
          icon={GoogleIcon}
          iconAltText='Google'
          provider='google'
        />
        <div>
          Do not have an account?
          <Link href='/sign-up' className='ml-1 text-primary-7 font-semibold'>
            Sign up
          </Link>
        </div>
      </div>
      <div className='w-1/2 h-full hidden md:flex bg-slate-400'>

      </div>
    </div>
  )
}