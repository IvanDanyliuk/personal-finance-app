'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { incomeSchema, IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';


export const AddIncomeForm: React.FC = () => {
  const t = useTranslations('IncomesPage');
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<IncomeSchema>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { userId: '', amount: 0, source: '', comment: '', createdAt: new Date() },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<IncomeSchema> = async (data) => {

  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          
        </form>
      </DialogContent>
    </Dialog>
  );
};