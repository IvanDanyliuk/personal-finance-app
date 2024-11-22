import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import Spinner from '../../public/images/tube-spinner.svg';
import Image from 'next/image';


interface ISubmitButton {
  label: string;
  
}

export const SubmitButton: React.FC<ISubmitButton> = ({
  label
}) => {
  const { pending } = useFormStatus();

  return (
    <Button 
      type='submit' 
      disabled={pending}
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
          label
      }
    </Button>
  );
};