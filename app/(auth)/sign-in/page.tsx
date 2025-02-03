import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import GoogleIcon from '../../../public/images/google.svg';
import { Separator } from '@/components/ui/separator';
import { DecorChips, SignInForm, SignInWithProvider } from '../_components';
import { auth } from '@/auth';


export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('General.metadata.signIn');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
};


export default async function SignInPage() {
  const session = await auth();
  const t = await getTranslations();

  if(session && session.user) {
    redirect('/');
  }

  return (
    <div className='relative w-full h-screen flex bg-background'>
      <div className='px-6 w-full md:w-1/2 h-full flex flex-col justify-center items-center gap-8 bg-background'>
        <div className='mb-4'>
          <h1 className='mb-3 text-center text-3xl text-foreground font-semibold'>
            {t('Auth.signinPage.title')}
          </h1>
          <p className='px-10 text-center text-base text-foreground'>
            {t('Auth.signinPage.titleMessage')}
          </p>
        </div>
        <SignInForm />
        <div className='w-full flex items-center gap-3'>
          <Separator className='flex-1' />
          <p className='text-foreground text-sm'>
            {t('Auth.signinPage.continueText')}
          </p>
          <Separator className='flex-1' />
        </div>
        <SignInWithProvider 
          tooltipLabel={t('Auth.signinPage.googleBtnTooltip')}
          tooltipSide='bottom'
          icon={GoogleIcon}
          iconAltText='Google'
          provider='google'
        />
        <div>
          {t('Auth.signinPage.noAccountText')}
          <Link 
            href='/sign-up' 
            className='ml-1 text-primary-7 font-semibold'
          >
            {t('Auth.signinPage.signupLinkLabel')}
          </Link>
        </div>
      </div>
      <div className='w-1/2 h-full hidden md:block bg-background'>
        <DecorChips />
      </div>
    </div>
  );
};