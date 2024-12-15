'use server';

import { auth } from "@/auth";
import { ActionStatus } from "../types/common.types";
import { incomeSchema } from "../types/form-schemas/incomes";
import { db } from "@/db";
import { revalidatePath } from "next/cache";


export const getIncomes = async ({ 
  sort, 
  amountFrom,
  amountTo,
  dateFrom,
  dateTo,
  source,
  currency
}: { 
  sort?: 'asc' | 'desc'; 
  amountFrom?: any;
  amountTo?: any; 
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  currency?: string;
}) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    const data = await db.income.findMany({ where: { userId: session.user!.id! } });
    const count = await db.income.count({ where: { userId: session.user!.id! } });

    return {
      status: ActionStatus.Success,
      data,
      count,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: [],
      count: 0,
      error: error.message,
    };
  }
}

export const createIncome = async (formData: FormData) => {
  try {
    const session = await auth();

    const userId = formData.get('userId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const source = formData.get('source') as string;
    const comment = formData.get('comment') as string;

    if(!session || session.user?.id !== userId) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    const validatedFields = incomeSchema.safeParse({
      userId, date: new Date(date), amount: +amount, currency, source, comment
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    await db.income.create({
      data: validatedFields.data
    });
    
    revalidatePath('/incomes');

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

export const updateIncome = async () => {
  try {
    console.log('UPDATE')

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

export const deleteIncome = async (id: string) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    await db.income.delete({ where: { id } });

    revalidatePath('/incomes');

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