export interface IUser {
  id?: string;
  name: string;
  email: string;
  image: string;
  accounts?: string;
  role?: string;
  bankAccounts?: string[];
  incomes?: string[];
  expenses?: string[];
  weekStartDay?: number;
  currency?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
};