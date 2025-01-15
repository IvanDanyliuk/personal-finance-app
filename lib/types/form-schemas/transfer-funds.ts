import { z as zod } from 'zod';

export const transferFundsSchema = zod.object({
  userId: zod.string(),
  amount: zod.number().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredAmount'),
  accountFrom: zod.string()
})