'use client';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar, CalendarProps } from '../ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';


export const DatePicker: React.FC<CalendarProps> = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
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
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()} className='w-auto p-0 bg-background z-50'>
        <Calendar
          {...props}
          className='bg-background'
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};