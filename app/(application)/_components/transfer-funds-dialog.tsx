'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IBankAccount } from "@/lib/types/bank";


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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ul>
          {bankAccounts
            .map(item => (
              <li key={crypto.randomUUID()}>
                {`Type: ${item.type}, Balance: ${item.balance}, Currency: ${item.currency}`}
              </li>
            )
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};