'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { ActionStatus, SortOrder } from '../types/common.types';
import { incomeSchema } from '../types/form-schemas/incomes';
import { db } from '@/db';
import { removeFalseyFields } from '../helpers';


export const getIncomes = async ({ 
  page,
  items,
  sortBy, 
  order = SortOrder.Desc,
  amountFrom,
  amountTo,
  dateFrom,
  dateTo,
  source,
  currency
}: { 
  page: string;
  items: string;
  sortBy?: string; 
  order?: SortOrder;
  amountFrom?: any;
  amountTo?: any; 
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  currency?: string;
}) => {
  try {
    const session = await auth();

    const sortQuery = sortBy && order ? { [sortBy]: order } : { createdAt: order }

    const filterData = removeFalseyFields({
      amount: amountFrom && !amountTo 
        ? { gte: +amountFrom } 
        : !amountFrom && amountTo 
          ? { lte: +amountTo } 
          : amountFrom && amountTo 
            ? { gte: +amountFrom, lte: +amountTo } 
            : null,
      date: dateFrom && !dateTo 
        ? { gte: new Date(dateFrom) } 
        : !dateFrom && dateTo 
          ? { lte: new Date(dateTo) } 
          : dateFrom && dateTo 
            ? { gte: new Date(dateFrom), lte: new Date(dateTo) } 
            : null,
      source: source ? { in: source.split(';') } : null,
      currency: currency ? { in: currency.split(';') } : null,
    });

    if(!session) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    const data = await db.income.findMany({ 
      where: { 
        userId: session.user!.id!,
        ...filterData
      }, 
      orderBy: sortQuery,
      skip: (+page - 1) * +items, 
      take: +items 
    });
    const count = await db.income.count({ 
      where: { 
        userId: session.user!.id!, 
        ...filterData 
      } 
    });

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
};

export const createIncome = async (formData: FormData) => {
  try {
    const session = await auth();

    const userId = formData.get('userId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const bankAccountId = formData.get('bankAccountId') as string;
    const source = formData.get('source') as string;
    const comment = formData.get('comment') as string;

    if(!session || session.user?.id !== userId) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    const validatedFields = incomeSchema.safeParse({
      userId, 
      date: new Date(date), 
      amount: +amount, 
      currency, 
      bankAccountId, 
      source, 
      comment
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const destinationAccount = await db.bankAccount.findFirst({ where: { id: validatedFields.data.bankAccountId } });

    if(!destinationAccount) {
      throw new Error('Cannot find a bank account with such ID');
    }

    await db.income.create({
      data: validatedFields.data
    });

    await db.bankAccount.update({
      where: {
        id: validatedFields.data.bankAccountId
      },
      data: {
        balance: destinationAccount.balance + validatedFields.data.amount
      }
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

export const updateIncome = async (formData: FormData) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('IncomesPage.errors.wrongUserId');
    }

    const id = formData.get('id') as string;
    const userId = formData.get('userId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const bankAccountId = formData.get('bankAccountId') as string;
    const source = formData.get('source') as string;
    const comment = formData.get('comment') as string;

    const validatedFields = incomeSchema.safeParse({
      userId, 
      date: new Date(date), 
      amount: +amount, 
      currency, 
      bankAccountId, 
      source, 
      comment
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    await db.income.update({ 
      where: { id }, 
      data: {
        ...validatedFields.data
      } 
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