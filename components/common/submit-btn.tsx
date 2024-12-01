import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '../ui/button';
import Spinner from '../../public/images/tube-spinner.svg';
import { ReactNode } from 'react';


interface ISubmitButton {
  disabled?: boolean;
  children: ReactNode;
}

export const SubmitButton: React.FC<ISubmitButton> = ({
  disabled, children
}) => {
  const { pending } = useFormStatus();

  return (
    <Button 
      type='submit' 
      disabled={disabled ? pending || disabled : disabled}
      className='w-full py-6 mt-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'
    >
      {
        pending ? 
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