import { z as zod } from 'zod';
import { AccountType } from '../bank';


const basicBankAccountSchema = zod.object({
  type: zod.nativeEnum(AccountType),
  country: zod.string().optional(),
  bankId: zod.string().optional(),
  accountNumber: zod.string().optional(),
  cardNumber: zod
    .number()
    .optional()
    .refine(
      (value) => !value || value.toString().length === 16,
      {
        message: 'HomePage.errors.createBankAccount.fieldsValidation.cardNumberMaxLength',
      }
    ),
  paymentSystem: zod.string().optional(),
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