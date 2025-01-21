'use server';

import { auth } from '@/auth';
import { ActionStatus } from '../types/common.types';
import { db } from '@/db';
import { removeFalseyFields } from '../helpers';


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

export const getMonthlySavingsControlDataByYears = async ({ 
  year, 
  dateFrom, 
  dateTo
}: { 
  year?: number; 
  dateFrom?: string; 
  dateTo?: string; 
}) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    if(!year && !dateFrom && !dateTo) {
      throw new Error('Pass a period or a period value');
    } 

    const periodQuery = year ? {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    } : removeFalseyFields({ 
      gte: dateFrom ? new Date(dateFrom) : null, 
      lte: dateTo ? new Date(dateTo) : null,
    });

    const incomes = await db.income.findMany({
      where: {
        userId: session.user.id,
        date: periodQuery,
      },
      select: {
        amount: true,
        currency: true,
        date: true,
      },
    });

    const expenses = await db.expense.findMany({
      where: {
        userId: session.user.id,
        date: periodQuery,
      },
      select: {
        amount: true,
        currency: true,
        date: true,
      },
    });

    const groupedData: Record<number, Record<string, { totalIncomes: number; totalExpenses: number }>> = {};

    for (const income of incomes) {
      const month = new Date(income.date).getMonth() + 1;
      const currency = income.currency;

      if (!groupedData[month]) groupedData[month] = {};
      if (!groupedData[month][currency]) groupedData[month][currency] = { totalIncomes: 0, totalExpenses: 0 };

      groupedData[month][currency].totalIncomes += income.amount;
    }

    for (const expense of expenses) {
      const month = new Date(expense.date).getMonth() + 1;
      const currency = expense.currency;

      if (!groupedData[month]) groupedData[month] = {};
      if (!groupedData[month][currency]) groupedData[month][currency] = { totalIncomes: 0, totalExpenses: 0 };

      groupedData[month][currency].totalExpenses += expense.amount;
    }

    const result = Object.entries(groupedData).map(([month, currencies]) => ({
      month: Number(month),
      data: Object.entries(currencies).map(([currency, totals]) => ({
        currency,
        ...totals,
      })),
    }));
  
    result.sort((a, b) => a.month - b.month);

    return {
      status: ActionStatus.Success,
      data: result,
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