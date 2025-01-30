'use server';

import { auth } from '@/auth';
import { ActionStatus } from '../types/common.types';
import { revalidatePath } from 'next/cache';
import { BankAccountSchema, bankAccountSchema } from '../types/form-schemas/bank-account';
import { db } from '@/db';
import { getCurrentDate, removeFalseyFields } from '../helpers';
import { AccountType } from '../types/bank';
import { replenishAccountSchema, transferFundsSchema } from '../types/form-schemas/transfer-funds';


export const getFunds = async () => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    const userAccounts = await db.bankAccount.findMany({ 
      where: { 
        userId: session.user?.id 
      }, 
      include: {
        bank: true
      }
    });

    revalidatePath('/');

    return {
      status: ActionStatus.Success,
      data: userAccounts,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: [],
      error: error.message,
    };
  }
};

export const createBankAccount = async (formData: FormData) => {
  try {
    const session = await auth();
    
    if(!session) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    const validatedFields = bankAccountSchema.safeParse({
      type: formData.get('type'), 
      country: formData.get('country'), 
      bankId: formData.get('bankId'),
      accountNumber: formData.get('accountNumber'),
      cardNumber: formData.get('cardNumber') ? +formData.get('cardNumber')! : undefined,
      paymentSystem: formData.get('paymentSystem'),
      balance: +formData.get('balance')!,
      currency: formData.get('currency'),
      additionalInfo: formData.get('additionalInfo'),
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    if(validatedFields.data.type === AccountType.Jug) {
      const existingJugs = await db.bankAccount.findFirst({ 
        where: { 
          userId: session.user?.id, 
          type: AccountType.Jug, 
          currency: validatedFields.data.currency 
        } 
      });

      if(existingJugs) {
        throw new Error('HomePage.errors.createBankAccount.jugsWithSameCurrency');
      }
    }

    const bankAccountData = {
      ...removeFalseyFields(validatedFields.data) as BankAccountSchema,
      userId: session.user!.id!
    };

    await db.bankAccount.create({ 
      data: bankAccountData 
    });

    revalidatePath('/');
    
    return {
      status: ActionStatus.Success,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message,
    };
  }
};

export const getBankAccountCount = async () => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const count = await db.bankAccount.count({
      where: {
        userId: session.user.id!,
      }
    });

    return {
      status: ActionStatus.Success,
      count,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      count: 0,
      error: error.message,
    };
  }
}

export const deleteAccount = async (id: string) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    const isAccountExist = await db.bankAccount.findFirst({ where: { id, userId: session.user?.id } });

    if(!isAccountExist) {
      throw new Error('HomePage.errors.accountNotExist');
    }

    await db.bankAccount.delete({ where: { id } });

    revalidatePath('/');

    return {
      status: ActionStatus.Success,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message,
    };
  }
};

export const transferFunds = async (formData: FormData) => {
  try {
    const session = await auth();

    const validatedFields = transferFundsSchema.safeParse({
      userId: formData.get('userId'),
      accountFromId: formData.get('accountFromId'),
      accountToId: formData.get('accountToId'),
      amount: formData.get('amount') ? +formData.get('amount')! : undefined,
      currency: formData.get('currency'),
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    if(session && session.user && session.user.id !== validatedFields.data.userId) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    const destinationAccount = await db.bankAccount.findFirst({ 
      where: { 
        id: validatedFields.data.accountToId 
      } 
    });
    const sourceAccount = await db.bankAccount.findFirst({ 
      where: { 
        id: validatedFields.data.accountFromId 
      } 
    });

    if(destinationAccount?.currency !== sourceAccount?.currency) {
      throw new Error('HomePage.errors.differentCurrencies');
    }

    if(sourceAccount!.balance < validatedFields.data.amount) {
      throw new Error('HomePage.errors.transferFunds.notEnoughFunds')
    }

    await db.fundTransfer.create({ data: validatedFields.data });
    
    await db.bankAccount.update({ 
      where: { 
        id: validatedFields.data.accountFromId 
      }, 
      data: { 
        balance: sourceAccount!.balance - validatedFields.data.amount 
      } 
    });

    await db.bankAccount.update({
      where: { 
        id: validatedFields.data.accountToId 
      }, 
      data: { 
        balance: destinationAccount!.balance + +validatedFields.data.amount 
      } 
    });

    revalidatePath('/');

    return {
      status: ActionStatus.Success,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message,
    };
  }
};

export const replenishAccount = async (formData: FormData) => {
  try {
    const session = await auth();

    const validatedFields = replenishAccountSchema.safeParse({
      userId: formData.get('userId'),
      accountId: formData.get('accountId'),
      amount: formData.get('amount') ? +formData.get('amount')! : undefined,
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    if(session && session.user && session.user.id !== validatedFields.data.userId) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    const account = await db.bankAccount.findFirst({
      where: {
        id: validatedFields.data.accountId,
        userId: validatedFields.data.userId
      },
      include: {
        bank: true,
      },
    });

    if(!account) {
      throw new Error('HomePage.errors.transferFunds.accountNotFound');
    }

    await db.bankAccount.update({
      where: {
        id: validatedFields.data.accountId,
        userId: validatedFields.data.userId
      },
      data: {
        balance: account.balance + +validatedFields.data.amount,
      },
    });

    await db.income.create({
      data: {
        userId: validatedFields.data.userId, 
        date: getCurrentDate(), 
        amount: +validatedFields.data.amount, 
        currency: account.currency, 
        bankAccountId: account.id, 
        source: 'replenishment', 
        comment: account.type === AccountType.BankAccount 
          ? `№${account.accountNumber} (${account.bank?.name})` 
          : '-',
      }
    });

    revalidatePath('/');

    return {
      status: ActionStatus.Success,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message,
    };
  }
};