'use client';

import { useState } from 'react';
import { ControllerRenderProps, UseFormRegister } from 'react-hook-form';
import { Check, CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  // CommandInput, 
  CommandItem, 
  CommandList 
} from '../ui/command';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';


interface ICombobox {
  name: string;
  label?: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
  placeholder: string;
  register?: UseFormRegister<any>;
  field?: ControllerRenderProps<any>;
  onHandleChange?: any;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
};


export const Combobox: React.FC<ICombobox> = ({
  name,
  label,
  options,
  field,
  register,
  placeholder,
  disabled,
  error
}) => {
  const t = useTranslations();
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className='w-full space-y-1'>
      {label && (
        <Label 
          htmlFor={name}
          className='w-31 text-sm text-foreground font-semibold'
        >
          {label}
        </Label>
      )}
      <div className='w-full'>
        <DropdownMenu open={isOpen} onOpenChange={setOpen}>
          <DropdownMenuTrigger disabled={disabled} asChild>
            <Button 
              variant='outline' 
              role='combobox' 
              aria-expanded={isOpen} 
              className='w-full p-6 rounded-full justify-between'
            >
              {field?.value 
                ? t(options.find(option => option.value === field.value!)?.label) 
                : (placeholder || '')
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-background'>
            <Command className='z-50'>
              {/* <CommandInput placeholder={placeholder} /> */}
              <CommandList>
                <CommandEmpty>
                  {t('General.noData')}
                </CommandEmpty>
                <CommandGroup>
                  {options.map(option => (
                    <CommandItem
                      key={crypto.randomUUID()}
                      value={option.value}
                      onSelect={field?.onChange}
                    >
                      <Check 
                        className={cn(
                          'mr-2 h-4 w-4',
                          field?.value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {t(option.label)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <input type="hidden" {...(register ? register(name) : field ? field : {})} />
          </DropdownMenuContent>
        </DropdownMenu>
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