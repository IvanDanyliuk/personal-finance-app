import { ControllerRenderProps, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CircleAlert } from 'lucide-react';
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';


interface ITextField {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  variant?: 'horizontal' | 'vertical';
  register?: UseFormRegister<any>;
  field?: ControllerRenderProps<any>,
  required?: boolean;
  disabled?: boolean;
  error?: string;
};


export const TextField: React.FC<ITextField> = ({
  label,
  name,
  type,
  placeholder,
  variant = 'vertical',
  register,
  field,
  required,
  disabled,
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
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className='w-full px-5 py-6 rounded-full'
          {...(register ? register(name, { valueAsNumber: type === 'number' }) : field ? field : {})}
          onChange={(value) => field?.onChange(type === 'number' ? value.target.valueAsNumber : value)}
        />
        <p className='mt-1 flex items-center gap-1 text-sm text-danger-2'>
          {error && (
            <>
              <CircleAlert className='w-4 h-4' />
              <span>
                {t(error)}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};