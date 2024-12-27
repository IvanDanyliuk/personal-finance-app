import { useTranslations } from 'next-intl';
import { ControllerRenderProps, UseFormRegister } from 'react-hook-form';
import { CircleAlert } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';


interface ISelectField {
  name: string;
  label?: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
  register?: UseFormRegister<any>;
  field: ControllerRenderProps<any>;
  variant?: 'vertical' | 'horizontal';
  onHandleChange?: any;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}


export const SelectField: React.FC<ISelectField> = ({
  name,
  label,
  options, 
  field, 
  variant = 'horizontal',
  onHandleChange,
  placeholder, 
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
        <Select 
          onValueChange={(value) => {
            field.onChange(value);
            if(onHandleChange) onHandleChange();
          }} 
          value={field.value}
        >
          <SelectTrigger disabled={disabled} className={cn(
            variant === 'vertical' ? 'w-full' : 'w-fit',
            'min-w-[190px] px-6 py-6 rounded-full'
          )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {options.map(({ value, label, icon }) => (
              <SelectItem key={crypto.randomUUID()} value={`${value}`} className='flex items-center'>
                {icon && (
                  <Image 
                    src={icon} 
                    alt={value} 
                    width={16} 
                    height={16} 
                    className='mr-2 inline' 
                  />
                )}
                {t(label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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