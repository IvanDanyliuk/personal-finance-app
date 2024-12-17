import { z as zod } from 'zod';


export const incomeSchema = zod.object({
  userId: zod.string(),
  date: zod.date(),
  amount: zod.number().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredAmount'),
  currency: zod.string().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredCurrency'),
  source: zod.string().min(1, 'IncomesPage.errors.createIncome.fieldsValidation.requiredSource'),
  comment: zod.string().or(zod.null()),
});

export const incomesFilteringByDateSchema = zod.object({
  dateFrom: zod.date().nullable().optional(),
  dateTo: zod.date().nullable().optional(),
});

export const incomesGeneralFiltersSchema = zod.object({
  amountFrom: zod.number().nullable().optional(),
  amountTo: zod.number().nullable().optional(),
  source: zod.array(zod.string().nullable()).optional(),
});

export type IncomeSchema = zod.infer<typeof incomeSchema>;
export type IncomesFilteringByDateSchema = zod.infer<typeof incomesFilteringByDateSchema>;
export type IncomesGeneralFiltersSchema = zod.infer<typeof incomesGeneralFiltersSchema>;