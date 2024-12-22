'use client';

import { X } from 'lucide-react';
import { MouseEventHandler } from 'react';


interface IChip {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Chip: React.FC<IChip> = ({ title, onClick }) => {
  return (
    <div className='px-3 py-1 w-fit flex items-center gap-1 border border-background-neutral bg-background-secondary rounded-full'>
      <span className='text-sm'>
        {title}
      </span>
      <button onClick={onClick} className='bg-transparent'>
        <X className='cursor-pointer w-5 h-5' />
      </button>
    </div>
  );
};