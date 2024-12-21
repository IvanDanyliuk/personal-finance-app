'use client';

import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


interface ITableRowActionsMenu {
  updateBtnLabel: string;
  deleteBtnLabel: string;
  onUpdate: () => void;
  onDelete: () => void;
};


export const TableRowActionsMenu: React.FC<ITableRowActionsMenu> = ({
  updateBtnLabel,
  deleteBtnLabel,
  onUpdate,
  onDelete
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-full flex justify-end'>
        <EllipsisVertical className='w-5 h-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background text-foreground'>
        <DropdownMenuItem onClick={onUpdate} className='flex items-center gap-1 text-sm'>
          <Pencil className='w-5 h-5' />
          {updateBtnLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className='w-5 h-5' />
          {deleteBtnLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};