'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IBankAccount } from "@/lib/types/bank";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";


interface ITransferFundsDialog {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bankAccounts: IBankAccount[];
}

export const TransferFundsDialog: React.FC<ITransferFundsDialog> = ({ 
  open, 
  onOpenChange, 
  bankAccounts
}) => {
  const t = useTranslations();

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, isSubmitting }
  // } = useForm<ITransferFunds>({
  //   resolver: zodResolver(transferSchema),
  //   defaultValues: {

  //   },
  // });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form action="">

        </form>
      </DialogContent>
    </Dialog>
  );
};