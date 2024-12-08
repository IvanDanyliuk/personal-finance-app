import { ReactNode } from 'react';
// import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '../ui/button';
import Spinner from '../../public/images/tube-spinner.svg';
import { cn } from '@/lib/utils';


interface ISubmitButton {
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  children: ReactNode;
};


export const SubmitButton: React.FC<ISubmitButton> = ({
  disabled, isSubmitting, className, children
}) => {
  // const { pending } = useFormStatus();

  return (
    <Button 
      type='submit' 
      disabled={disabled || isSubmitting}
      className={cn(
        className ? className : '',
        'w-full py-6 mt-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'
      )}
    >
      {
        isSubmitting ? 
          <Image 
            src={Spinner} 
            alt='Loading' 
            width={20} 
            height={20} 
          /> : 
          <>
            {children}
          </>
      }
    </Button>
  );
};