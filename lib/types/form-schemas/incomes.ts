import { z as zod } from 'zod';


export const incomeSchema = zod.object({
  userId: zod.string(),
  date: zod.date(),
  amount: zod.number().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredAmount'),
  currency: zod.string().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredCurrency'),
  source: zod.string().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredSource'),
  comment: zod.string(),
});

export type IncomeSchema = zod.infer<typeof incomeSchema>;