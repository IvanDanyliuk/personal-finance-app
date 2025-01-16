'use server';

import { auth } from '@/auth';
import { ActionStatus } from '../types/common.types';
import { revalidatePath } from 'next/cache';
import { BankAccountSchema, bankAccountSchema } from '../types/form-schemas/bank-account';
import { db } from '@/db';
import { removeFalseyFields } from '../helpers';
import { AccountType } from '../types/bank';


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
      data: null,
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
    console.log('TRANSFER FUNDS ACTION', formData)

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