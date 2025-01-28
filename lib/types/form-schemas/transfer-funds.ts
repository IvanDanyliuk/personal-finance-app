import { z as zod } from 'zod';


export const transferFundsSchema = zod.object({
  userId: zod.string(),
  amount: zod.number().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  accountFromId: zod.string().min(1, 'HomePage.errors.createExpense.fieldsValidation.requiredAccountFrom'),
  accountToId: zod.string().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAccountTo'),
  currency: zod.string().min(1, 'HomePage.errors.transferFundsForm.requireCurrency')
});

export const replenishAccountSchema = zod.object({
  userId: zod.string(),
  amount: zod.number().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  accountId: zod.string().min(1, 'HomePage.errors.createExpense.fieldsValidation.requiredAmount')
});

export type TransferFundsSchema = zod.infer<typeof transferFundsSchema>;
export type ReplenishAccountSchema = zod.infer<typeof replenishAccountSchema>;