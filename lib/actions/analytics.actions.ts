'use server';

import { auth } from '@/auth';
import { ActionStatus } from '../types/common.types';
import { db } from '@/db';


export const getYearsOfSavings = async () => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const incomeYears = await db.income.groupBy({
      by: ['date'],
      _count: {
        id: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    const expenseYears = await db.expense.groupBy({
      by: ['date'],
      _count: {
        id: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const incomeYearSet = new Set(incomeYears.map((income) => new Date(income.date).getFullYear()));
    const expenseYearSet = new Set(expenseYears.map((expense) => new Date(expense.date).getFullYear()));

    const allYears = Array.from(new Set([...incomeYearSet, ...expenseYearSet])).sort((a, b) => b - a);

    return {
      status: ActionStatus.Success,
      data: allYears,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: [],
      error: error.message
    };
  }
};

export const getSavingsControlData = async (year: number) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    return {
      status: ActionStatus.Success,
      data: [],
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: [],
      error: error.message
    };
  }
};