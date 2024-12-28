import { z as zod } from 'zod';


export const bankSchema = zod.object({
  name: zod.string().min(1, 'Bank name is required'),
  country: zod.string().min(1, 'Select a country'),
  logo: zod.string().min(1, 'Bank logo is required'),
});

export type BankSchema = zod.infer<typeof bankSchema>;