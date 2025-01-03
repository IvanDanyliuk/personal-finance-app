import { z as zod } from 'zod';


export const bankAccountSchema = zod.object({
  type: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredType'),
  country: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredCountry'),
  bankId: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredBank'),
  balance: zod.number().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredBalance'),
  currency: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredCurrency'),
  additionalInfo: zod.string()
});

// export const bankAccountSchema = zod.object({
//   type: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredType'),
//   country: zod.string().optional(),
//   bankId: zod.string().optional(),
//   balance: zod.number().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredBalance'),
//   currency: zod.string().min(1, 'HomePage.errors.createBankAccount.fieldsValidation.requiredCurrency'),
//   additionalInfo: zod.string()
// }).refine((data) => 
//   data.type === 'bank_account' || (data.bankId && data.country),
//   {
//     message: 'HomePage.errors.createBankAccount.fieldsValidation.requiredBank',
//     path: ['bankId', 'country']
//   }
// );

export type BankAccountSchema = zod.infer<typeof bankAccountSchema>;