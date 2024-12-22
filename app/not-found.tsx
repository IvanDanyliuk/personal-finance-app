import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NotFound from '../public/images/not-found.svg';


export default function NotFoundPage() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-8'>
      <Image 
        src={NotFound} 
        alt='Page Not Found' 
        width={500} 
        height={500} 
      />
      <Link 
        href='/' 
        className='px-10 py-3 text-md bg-primary-7 hover:bg-primary-6 text-white font-semibold rounded-full transition-colors duration-300'
      >
        <ArrowLeft className='inline mr-1' />
        Go back
      </Link>
    </div>
  );
};