import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import GoogleIcon from '../../../public/images/google.svg';
import { Separator } from '@/components/ui/separator';
import { SignInForm, SignInWithProvider } from '../_components';
import { auth } from '@/auth';


export default async function SignInPage() {
  const session = await auth();
  const t = await getTranslations('Auth.signinPage');

  if(session && session.user) {
    redirect('/');
  }

  return (
    <div className='relative w-full h-screen flex'>
      <div className='px-6 md:px-72 w-full md:w-1/2 h-full flex flex-col justify-center items-center gap-8 bg-background'>
        <div className='mb-4'>
          <h1 className='mb-3 text-center text-3xl text-foreground font-semibold'>
            {t('title')}
          </h1>
          <p className='text-center text-base text-foreground'>
            {t('titleMessage')}
          </p>
        </div>
        <SignInForm />
        <div className='w-full flex items-center gap-3'>
          <Separator className='flex-1' />
          <p className='text-foreground text-sm'>
            {t('continueText')}
          </p>
          <Separator className='flex-1' />
        </div>
        <SignInWithProvider 
          tooltipLabel={t('googleBtnTooltip')}
          tooltipSide='bottom'
          icon={GoogleIcon}
          iconAltText='Google'
          provider='google'
        />
        <div>
          {t('noAccountText')}
          <Link 
            href='/sign-up' 
            className='ml-1 text-primary-7 font-semibold'
          >
            {t('signupLinkLabel')}
          </Link>
        </div>
      </div>
      <div className='w-1/2 h-full hidden md:flex bg-slate-400'>

      </div>
    </div>
  )
}