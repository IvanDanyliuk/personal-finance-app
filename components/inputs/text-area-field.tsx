import { ControllerRenderProps, UseFormRegister } from 'react-hook-form';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';


interface ITextAreaField {
  label?: string;
  name: string;
  placeholder?: string;
  variant?: 'horizontal' | 'vertical';
  register?: UseFormRegister<any>;
  field?: ControllerRenderProps<any>,
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  cols?: number;
  error?: string;
};


export const TextAreaField: React.FC<ITextAreaField> = ({
  label,
  name,
  placeholder,
  variant = 'vertical',
  register,
  field,
  required,
  disabled,
  maxLength,
  rows,
  cols,
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
        <Textarea 
          id={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          cols={cols}
          className='w-full px-5 py-3 rounded-3xl'
          {...(register ? register(name) : field ? field : {})}
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
  )
}