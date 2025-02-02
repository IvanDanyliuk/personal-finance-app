import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ImagePlaceholder from '@/public/images/app-monetization.svg';


export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('General.metadata.savings');
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


export default function SavingsPage() {
  const t = useTranslations();

  return (
    <div className='w-full h-full flex-col flex justify-center items-center gap-6'>
      <Image 
        src={ImagePlaceholder}
        alt='placeholder'
        width={500}
        height={500}
      />
      <h1 className='text-center text-xl text-primary-7 font-semibold'>
        {t('General.inDevelopment.title')}
      </h1>
      <p className='text-center text-secondary-6'>
        {t('General.inDevelopment.message')}
      </p>
    </div>
  );
};