'use client';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar, CalendarProps } from '../ui/calendar';



export const DatePicker: React.FC<CalendarProps> = (props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full px-5 py-6 justify-start text-left font-normal rounded-full',
            !props.selected && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {
            props.selected && props.selected instanceof Date ? 
              format(props.selected, 'PPP') : 
              <span>Pick a date</span>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          {...props}
          className='bg-white'
        />
      </PopoverContent>
    </Popover>
  );
};