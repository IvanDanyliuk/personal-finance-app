'use client';

import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';


interface ISignInWithProvider {
  tooltipLabel: string;
  tooltipSide?: 'left' | 'top' | 'right' | 'bottom';
  icon: StaticImport | string;
  iconAltText?: string;
  onSignIn: () => void;
};


export const SignInWithProvider: React.FC<ISignInWithProvider> = ({
  tooltipLabel,
  tooltipSide = 'top',
  icon,
  iconAltText,
  onSignIn
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        <div 
          onClick={onSignIn}
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