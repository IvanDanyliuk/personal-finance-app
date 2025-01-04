import { z as zod } from 'zod';


const basicBankAccountSchema = zod.object({
  type: zod.enum(['bank_account', 'jug']),
  country: zod.string().optional(),
  bankId: zod.string().optional(),
  balance: zod.number().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredBalance'),
  currency: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredCurrency'),
  additionalInfo: zod.string()
});

export const bankAccountSchema = basicBankAccountSchema.superRefine((data, ctx) => {
  if(data.type === 'bank_account') {
    if(!data.country) {
      ctx.addIssue({
        path: ['country'],
        message: 'HomePage.errors.createBankAccount.fieldsValidation.requiredCountry',
        code: 'custom'
      });
    }

    if(!data.bankId) {
      ctx.addIssue({
        path: ['bankId'],
        message: 'HomePage.errors.createBankAccount.fieldsValidation.requiredBank',
        code: 'custom'
      })
    }
  }
});

export type BankAccountSchema = zod.infer<typeof bankAccountSchema>;