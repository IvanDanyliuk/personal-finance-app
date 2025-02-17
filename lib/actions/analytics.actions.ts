'use server';

import { auth } from '@/auth';
import { ActionStatus, SortOrder } from '../types/common.types';
import { db } from '@/db';
import { removeFalseyFields } from '../helpers';
import { getUser } from './user.actions';


export const getYearsOfSavings = async () => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const incomeYears = await db.income.groupBy({
      by: ['date'],
      where: {
        userId: session.user!.id!
      },
      _count: {
        id: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    const expenseYears = await db.expense.groupBy({
      by: ['date'],
      where: {
        userId: session.user!.id!
      },
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
  dateFrom, 
  dateTo,
  currency
}: {  
  dateFrom?: string; 
  dateTo?: string;
  currency?: string; 
}) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const currentUser = await getUser(session!.user!.email!);

    const currentYear = new Date().getFullYear();
    const query = !dateFrom && !dateTo 
      ? removeFalseyFields({
          date: removeFalseyFields({
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          }),
          currency: currency || currentUser?.currency,
        }) 
      : removeFalseyFields({ 
          date: removeFalseyFields({
            gte: dateFrom ? new Date(dateFrom) : null, 
            lte: dateTo ? new Date(dateTo) : null,
          }),
          currency: currency || currentUser?.currency,
        });

    const incomes = await db.income.findMany({
      where: {
        userId: currentUser!.id!,
        ...query,
      },
      select: {
        amount: true,
        currency: true,
        date: true,
      },
    });

    const expenses = await db.expense.findMany({
      where: {
        userId: currentUser!.id!,
        ...query,
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

    const firstMonth = result[0].month;
    const lastMonth = result[result.length - 1].month;

    const monthMap = new Map(result.map((item) => [item.month, item.data]));

    const data = [];
    for (let month = firstMonth; month <= lastMonth; month++) {
      data.push({
        month,
        data: monthMap.get(month) || [{ totalIncomes: 0, totalExpenses: 0, currency: 'empty' }],
      });
    }

    if(!dateFrom && !dateTo) {
      for(let month = lastMonth + 1; month <= 12; month++) {
        data.push({
          month,
          data: monthMap.get(month) || [{ totalIncomes: 0, totalExpenses: 0, currency: 'empty' }],
        });
      }
    }

    return {
      status: ActionStatus.Success,
      data,
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

export const getFundsStructureByCategories = async ({
  dateFrom, 
  dateTo,
  currency
}: {
  dateFrom?: string; 
  dateTo?: string;
  currency?: string;
}) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const currentUser = await getUser(session!.user!.email!);

    const currentYear = new Date().getFullYear();
    const query = !dateFrom && !dateTo 
      ? removeFalseyFields({
          date: removeFalseyFields({
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          }),
          currency: currency || currentUser?.currency,
        }) 
      : removeFalseyFields({ 
          date: removeFalseyFields({
            gte: dateFrom ? new Date(dateFrom) : null, 
            lte: dateTo ? new Date(dateTo) : null,
          }),
          currency: currency || currentUser?.currency,
        });

    const groupedIncomes = await db.income.groupBy({
      by: ['source'],
      where: {
        userId: session.user.id, 
        ...query
      },
      _sum: {
        amount: true, 
      },
    });

    const groupedExpenses = await db.expense.groupBy({
      by: ['category'],
      where: {
        userId: session.user.id, 
        ...query
      },
      _sum: {
        amount: true, 
      },
    });

    return {
      status: ActionStatus.Success,
      data: {
        incomes: groupedIncomes.map(item => ({ 
          source: item.source, 
          amount: item._sum.amount || 0
        })),
        expenses: groupedExpenses.map(item => ({ 
          category: item.category, 
          amount: item._sum.amount || 0
        })),
      },
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: {
        incomes: [],
        expenses: [],
      },
      error: error.message
    };
  }
};

export const getRecentActivity = async ({
  dateFrom, 
  dateTo,
}: {
  dateFrom?: string; 
  dateTo?: string;
}) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const currentUser = await getUser(session!.user!.email!);

    const currentYear = new Date().getFullYear();
    
    const dateQuery = !dateFrom && !dateTo 
      ? removeFalseyFields({
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        }) 
      : removeFalseyFields({
        gte: dateFrom ? new Date(dateFrom) : null, 
        lte: dateTo ? new Date(dateTo) : null,
      });

    const recentIncomes = await db.income.findMany({
      where: {
        userId: currentUser?.id,
        date: dateQuery
      },
      orderBy: {
        date: SortOrder.Desc
      },
      take: 10,
      include: {
        bankAccount: true,
      },
    });

    const recentExpenses = await db.expense.findMany({
      where: {
        userId: currentUser?.id,
        date: dateQuery
      },
      orderBy: {
        date: SortOrder.Desc
      },
      take: 10,
      include: {
        bankAccount: true
      }
    });

    const recentTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const allIncomes = await db.income.findMany({
      where: {
        userId: currentUser?.id,
        date: dateQuery
      }
    });
    const allExpenses = await db.expense.findMany({
      where: {
        userId: currentUser?.id,
        date: dateQuery
      }
    });

    function getTopByCurrency<T extends { currency: string; amount: number }>(
      items: T[]
    ): T[] {
      const topItemsMap = new Map<string, T>();

      for (const item of items) {
        const existing = topItemsMap.get(item.currency);
        if (!existing || item.amount > existing.amount) {
          topItemsMap.set(item.currency, item);
        }
      }

      return Array.from(topItemsMap.values());
    }

    const topIncomes = getTopByCurrency(allIncomes);
    const topExpenses = getTopByCurrency(allExpenses);

    return {
      status: ActionStatus.Success,
      data: {
        recentTransactions,
        topIncomes,
        topExpenses,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: {
        recentTransactions: [],
        topIncome: [],
        topExpense: []
      },
      error: error.message,
    };
  }
};

export const getFundsSummary = async ({
  dateFrom, 
  dateTo,
  currency
}: {
  dateFrom?: string; 
  dateTo?: string;
  currency?: string;
}) => {
  try {
    const session = await auth();

    if(!session || !session.user) {
      throw new Error('AnalyticsPage.errors.wrongUserId');
    }

    const currentUser = await getUser(session!.user!.email!);

    const currentYear = new Date().getFullYear();
    
    const dateQuery = !dateFrom && !dateTo 
      ? removeFalseyFields({
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        }) 
      : removeFalseyFields({
        gte: dateFrom ? new Date(dateFrom) : null, 
        lte: dateTo ? new Date(dateTo) : null,
      });

    const query = !dateFrom && !dateTo 
      ? removeFalseyFields({
          date: dateQuery,
          currency: currency || currentUser?.currency,
        }) 
      : removeFalseyFields({ 
          date: dateQuery,
          currency: currency || currentUser?.currency,
        });

    const groupedIncomes = await db.income.groupBy({
      by: ['currency'],
      where: {
        userId: session.user.id, 
        ...query
      },
      _sum: {
        amount: true,
      },
    });

    const groupedExpenses = await db.expense.groupBy({
      by: ['currency'],
      where: {
        userId: session.user.id, 
        ...query
      },
      _sum: {
        amount: true,
      },
    });
  
    const incomeSummary = groupedIncomes.map(({ currency, _sum }) => ({
      currency,
      value: _sum.amount || 0,
    }));

    const expensesSummary = groupedExpenses.map(({ currency, _sum }) => ({
      currency,
      value: _sum.amount || 0,
    }));

    return {
      status: ActionStatus.Success,
      data: {
        incomeSummary,
        expensesSummary
      },
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: {
        incomeSummary: [],
        expensesSummary: []
      },
      error: error.message,
    };
  }
};