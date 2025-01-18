'use server';

import { auth } from '@/auth';
import { ActionStatus, SortOrder } from '../types/common.types';
import { removeFalseyFields } from '../helpers';
import { db } from '@/db';
import { expenseSchema } from '../types/form-schemas/expenses';
import { revalidatePath } from 'next/cache';
import { AccountType } from '../types/bank';


export const getExpenses = async ({ 
  page,
  items,
  sortBy, 
  order = SortOrder.Desc,
  amountFrom,
  amountTo,
  dateFrom,
  dateTo,
  category,
  paymentMethod,
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
  category?: string;
  paymentMethod?: string;
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
      category: category ? { in: category.split(';') } : null,
      paymentMethod: paymentMethod ? { in: paymentMethod.split(';') } : null,
      currency: currency ? { in: currency.split(';') } : null,
    });

    if(!session) {
      throw new Error('ExpensePage  .errors.wrongUserId');
    }

    const data = await db.expense.findMany({ 
      where: { 
        userId: session.user!.id!,
        ...filterData
      }, 
      orderBy: sortQuery,
      skip: (+page - 1) * +items, 
      take: +items 
    });
    const count = await db.expense.count({ 
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

export const createExpense = async (formData: FormData) => {
  try {
    const session = await auth();

    const userId = formData.get('userId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const category = formData.get('category') as string;
    const destination = formData.get('destination') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const bankAccountId = formData.get('bankAccountId') as string;
    const comment = formData.get('comment') as string;

    if(!session || session.user?.id !== userId) {
      throw new Error('ExpensesPage.errors.wrongUserId');
    }

    const validatedFields = expenseSchema.safeParse({
      userId, 
      date: new Date(date), 
      amount: +amount, 
      currency, 
      category, 
      destination, 
      bankAccountId, 
      paymentMethod: paymentMethod === AccountType.BankAccount ? 'card' : 'cash', 
      comment
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const sourceAccount = await db.bankAccount.findFirst({ 
      where: { 
        id: validatedFields.data.bankAccountId 
      } 
    });

    if(!sourceAccount) {
      throw new Error('ExpensesPage.errors.noBankAccountFound');
    }

    if(sourceAccount.balance < +amount) {
      throw new Error('ExpensesPage.errors.noFunds');
    }

    await db.expense.create({
      data: validatedFields.data
    });

    await db.bankAccount.update({
      where: {
        id: validatedFields.data.bankAccountId
      },
      data: {
        balance: sourceAccount.balance - validatedFields.data.amount
      }
    });
    
    revalidatePath('/expenses');

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

export const updateExpense = async (formData: FormData) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('ExpensesPage.errors.wrongUserId');
    }

    const id = formData.get('id') as string;
    const userId = formData.get('userId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const category = formData.get('category') as string;
    const destination = formData.get('destination') as string;
    // const bankAccountId = formData.get('bankAccountId') as string;
    const comment = formData.get('comment') as string;

    // const fundsAccount = await db.bankAccount.findFirst({ where: { id: bankAccountId } });

    // if(!fundsAccount) {
    //   throw new Error('ExpensesPage.errors.noBankAccountFound')
    // }

    const validatedFields = expenseSchema.safeParse({
      userId, 
      date: new Date(date), 
      amount: +amount, 
      currency, 
      category, 
      destination, 
      // paymentMethod, 
      comment
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    await db.expense.update({ 
      where: { id }, 
      data: {
        ...validatedFields.data
      } 
    });

    revalidatePath('/expenses');

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

export const deleteExpense = async (id: string) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('ExpensesPage.errors.wrongUserId');
    }

    await db.expense.delete({ where: { id } });

    revalidatePath('/expenses');

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