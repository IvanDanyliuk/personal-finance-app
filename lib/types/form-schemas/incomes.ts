import { z as zod } from 'zod';


export const incomeSchema = zod.object({
  userId: zod.string(),
  amount: zod.number(),
  source: zod.string(),
  comment: zod.string(),
  createdAt: zod.date()
});

export type IncomeSchema = zod.infer<typeof incomeSchema>;