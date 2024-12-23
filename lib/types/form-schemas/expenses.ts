import { z as zod } from 'zod';

export const expenseSchema = zod.object({
  userId: zod.string(),
  date: zod.date(),
  amount: zod.number().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredAmount'),
  currency: zod.string().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredCurrency'),
  destination: zod.string().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredDestination'),
  paymentMethod: zod.string().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredPaymentMethod'),
  category: zod.string().min(1, 'ExpensesPage.errors.createExpense.fieldsValidation.requiredCategory'),
  comment: zod.string().or(zod.null()),
});

export const expensesFilteringByDateSchema = zod.object({
  dateFrom: zod.date().nullable().optional(),
  dateTo: zod.date().nullable().optional(),
});

export const expensesGeneralFiltersSchema = zod.object({
  amountFrom: zod.number().nullable().optional(),
  amountTo: zod.number().nullable().optional(),
  source: zod.array(zod.string().nullable()).optional(),
  currency: zod.array(zod.string().nullable()).optional(),
  destination: zod.array(zod.string().nullable()).optional(),
  paymentMethod: zod.array(zod.string().nullable()).optional(),
  category: zod.array(zod.string().nullable()).optional(),
});

export type ExpenseSchema = zod.infer<typeof expenseSchema>;
export type ExpensesFilteringByDateSchema = zod.infer<typeof expensesFilteringByDateSchema>;
export type ExpensesGeneralFiltersSchema = zod.infer<typeof expensesGeneralFiltersSchema>;