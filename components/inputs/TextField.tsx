import { ChangeEvent } from 'react';
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ITextField {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  variant?: 'horizontal' | 'vertical';
  value?: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
};


export const TextField: React.FC<ITextField> = ({
  label,
  name,
  type,
  placeholder,
  variant = 'vertical',
  value,
  defaultValue,
  required,
  onChange,
  error
}) => {
  return (
    <div className={cn(
      variant === 'vertical' ? 'flex-col' : 'flex-row items-center', 
      'w-full flex gap-1'
    )}>
      {label && (
        <Label 
          htmlFor={name}
          className='w-32 text-sm text-foreground font-semibold'
        >
          {label}
        </Label>
      )}
      <div className={cn(variant === 'vertical' ? 'w-full' : 'flex-1')}>
        <Input 
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          className='w-full px-5 py-6 rounded-full'
        />
        <p>
          {error && (
            <>
              <CircleAlert />
              <span>
                {error.join('. ').trim()}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};