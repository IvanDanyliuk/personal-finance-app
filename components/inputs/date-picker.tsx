'use client';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

interface IDatePicker {
  selected: Date; 
  mode?: 'single' | 'range' | 'multiple' | 'default';
  onSelect: () => void;
  initialFocus?: boolean;
};


export const DatePicker: React.FC<IDatePicker> = ({
  selected,
  mode = 'range',
  onSelect,
  initialFocus = true
}) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selected && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode={mode}
          selected={selected}
          onSelect={onSelect}
          initialFocus={initialFocus}
        />
      </PopoverContent>
    </Popover>
  )
}