import { z as zod } from 'zod';


export const transferFundsSchema = zod.object({
  userId: zod.string(),
  amount: zod.number().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  accountFromId: zod.string().min(1, 'HomePage.errors.createExpense.fieldsValidation.requiredAmount'),
  accountToId: zod.string().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  currency: zod.string().min(1, 'HomePage.errors.transferFundsForm.requireCurrency')
});

export type TransferFundsSchema = zod.infer<typeof transferFundsSchema>;