'use client';

import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { signInWithProvider } from '@/lib/actions/auth.actions';


interface ISignInWithProvider {
  tooltipLabel: string;
  tooltipSide?: 'left' | 'top' | 'right' | 'bottom';
  icon: StaticImport | string;
  iconAltText?: string;
  provider: string;
};


export const SignInWithProvider: React.FC<ISignInWithProvider> = ({
  tooltipLabel,
  tooltipSide = 'top',
  icon,
  iconAltText,
  provider
}) => {
  const handleSignIn = async () => {
    await signInWithProvider(provider);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        <div 
          onClick={handleSignIn}
          className='p-4 rounded-full bg-background border border-secondary-2'
        >
          <Image 
            src={icon} 
            alt={iconAltText || 'icon'} 
            width={20} 
            height={20} 
          />
        </div>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p className='text-foreground'>
            {tooltipLabel}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};