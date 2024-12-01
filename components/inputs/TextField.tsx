import { ChangeEvent } from 'react';
import { CircleAlert } from 'lucide-react';
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';


interface ITextField {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  variant?: 'horizontal' | 'vertical';
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
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
  disabled,
  onChange,
  error
}) => {
  const t = useTranslations();
  
  return (
    <div className={cn(
      variant === 'vertical' ? 'flex-col' : 'flex-row items-center', 
      'w-full flex gap-1'
    )}>
      {label && (
        <Label 
          htmlFor={name}
          className={cn(
            variant === 'vertical' ? 'w-31' : 'w-full',
            'text-sm text-foreground font-semibold'
          )}
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
          disabled={disabled}
          className='w-full px-5 py-6 rounded-full'
        />
        <p className='mt-1 flex items-center gap-1 text-sm text-danger-2'>
          {error && (
            <>
              <CircleAlert className='w-4 h-4' />
              <span>
                {error.map(err => t(err)).join('. ').trim()}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};