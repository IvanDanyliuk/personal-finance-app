'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';


export const AccountForm: React.FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const {
    control,
    formState,
    handleSubmit
  } = useForm()

  const handleMenuOpen = () => setOpen(!isOpen);

  const onFormSubmit = () => {

  }

  return (
    <Dialog open={isOpen} onOpenChange={handleMenuOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new bank account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>

        </form>
      </DialogContent>
    </Dialog>
  );
};