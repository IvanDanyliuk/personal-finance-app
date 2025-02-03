import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { DecorChips, SignInWithProvider, SignUpForm } from '../_components';
import GoogleIcon from '../../../public/images/google.svg';


export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('General.metadata.signUp');
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


export default function SignUpPage() {
  const t = useTranslations('Auth.signupPage');

  return (
    <div className='relative w-full h-screen flex'>
      <div className='px-6 w-full md:w-1/2 h-full flex flex-col justify-center items-center gap-8 bg-background'>
        <div className='mb-4'>
          <h1 className='mb-3 text-center text-3xl text-foreground font-semibold'>
            {t('title')}
          </h1>
          <p className='px-10 text-center text-base text-foreground'>
            {t('titleMessage')}
          </p>
        </div>
        <SignUpForm />
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
          {t('haveAccountText')}
          <Link 
            href='/sign-in' 
            className='ml-1 text-primary-7 font-semibold'
          >
            {t('signinLinkLabel')}
          </Link>
        </div>
      </div>
      <div className='w-1/2 h-full hidden md:flex bg-background'>
        <DecorChips />
      </div>
    </div>
  );
};