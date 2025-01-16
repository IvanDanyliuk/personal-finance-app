import { z as zod } from 'zod';


export const transferFundsSchema = zod.object({
  userId: zod.string(),
  // currentBalance: zod.number().optional(),
  amount: zod.number().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  accountFromId: zod.string().min(1, 'HomePage.errors.createExpense.fieldsValidation.requiredAmount'),
  accountToId: zod.string().min(1, 'HomePage.errors.transferFundsForm.fieldsValidation.requiredAmount'),
  currency: zod.string().min(1, 'HomePage.errors.transferFundsForm.requireCurrency')
});

// export const transferFundsSchema = basicTransferFundsSchema.superRefine((data, ctx) => {
//   if(data.currentBalance && +data.currentBalance < +data.amount) {
//     ctx.addIssue({
//       path: ['amount'],
//       message: 'HomePage.errors.transferFunds.fieldsValidation.notEnoughFunds',
//       code: 'custom'
//     });
//   }
// });

export type TransferFundsSchema = zod.infer<typeof transferFundsSchema>;