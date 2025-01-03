'use server';

import { auth } from "@/auth";
import { ActionStatus } from "../types/common.types";
import { revalidatePath } from "next/cache";
import { bankAccountSchema } from "../types/form-schemas/bank-account";
import { db } from "@/db";


export const createBankAccount = async (formData: FormData) => {
  try {
    const session = await auth();
    
    if(!session) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    console.log('CREATE BANK ACCOUNT', formData)


    const validatedFields = bankAccountSchema.safeParse({
      type: formData.get('type'), 
      country: formData.get('country'), 
      bankId: formData.get('bankId'),
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

    console.log('CREATE BANK ACCOUNT', validatedFields)

    if(validatedFields.data.type === 'jug') {
      const existingJugs = await db.bankAccount.findFirst({ 
        where: { 
          userId: session.user?.id, 
          type: 'jug', 
          currency: validatedFields.data.currency 
        } 
      });

      if(existingJugs) {
        throw new Error('HomePage.errors.createBankAccount.jugsWithSameCurrency');
      }
    }

    await db.bankAccount.create({ 
      data: {
        ...validatedFields.data,
        userId: session.user?.id!
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