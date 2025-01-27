export type CashFlow = {
  month: string; 
  income: number; 
  expenses: number;
};

export type FundsData = {
  month: string;
  value: number;
};

export type IncomeStructure = {
  source: string;
  amount: number;
  color: string;
};

export type ExpensesStructure = {
  category: string;
  amount: number;
  color: string;
};