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


interface ISelectField {
  name: string;
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  register?: UseFormRegister<any>;
  field: ControllerRenderProps<any>;
  variant?: 'vertical' | 'horizontal';
  onHandleChange?: any;
  defaultValue?: string;
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
            onHandleChange()
          }} 
          value={field.value}
        >
          <SelectTrigger disabled={disabled} className="w-[180px] px-6 py-6 rounded-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {options.map(({ value, label }) => (
              <SelectItem key={crypto.randomUUID()} value={`${value}`}>
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