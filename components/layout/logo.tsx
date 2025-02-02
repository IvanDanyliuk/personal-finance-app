'use client'

import Image from 'next/image';
import LogoImage from '@/public/images/logo.png';
import LogoImageShort from '@/public/images/logo_short.png';


export const Logo: React.FC = () => {
  const isSidebarExpanded = localStorage.getItem('isSidebarExpanded');
  console.log('IS EXPANDED', typeof isSidebarExpanded)
  return (
    <div className='py-3 w-full'>
      {isSidebarExpanded && !JSON.parse(isSidebarExpanded) ? (
        <Image 
          src={LogoImageShort} 
          alt='logo' 
          width={100} 
          height={30} 
          className='mx-auto'
        />
      ) : (
        <Image 
          src={LogoImage} 
          alt='logo' 
          width={100} 
          height={30} 
          className='mx-auto'
        />
      )}
    </div>
  );
};