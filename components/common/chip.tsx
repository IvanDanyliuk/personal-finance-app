'use client';

import { X } from 'lucide-react';


interface IChip {
  title: string;
  onClick?: () => void;
}

export const Chip: React.FC<IChip> = ({ title, onClick }) => {
  return (
    <div className='px-3 py-1 w-fit flex items-center gap-1 border border-background-neutral bg-background-secondary rounded-full'>
      <span className='text-sm'>
        {title}
      </span>
      <X onClick={onClick} className='cursor-pointer w-5 h-5' />
    </div>
  )
}