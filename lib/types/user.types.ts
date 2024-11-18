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
  createdAt?: string;
  updatedAt?: string;
};