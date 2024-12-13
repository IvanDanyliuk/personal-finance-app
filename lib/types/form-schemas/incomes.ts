import { z as zod } from 'zod';


export const incomeSchema = zod.object({
  userId: zod.string(),
  date: zod.date(),
  amount: zod.number(),
  currency: zod.string(),
  source: zod.string(),
  comment: zod.string(),
});

export type IncomeSchema = zod.infer<typeof incomeSchema>;