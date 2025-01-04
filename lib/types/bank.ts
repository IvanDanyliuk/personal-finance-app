export interface IBank {
  id: string;
  name: string;
  country: string;
  logo: string;
};

export interface IBankAccount {
  id: string;
  type: string;
  country?: string | null;
  bankId?: string | null;
  bank?: IBank | null;
  balance: number;
  currency: string;
  additionalInfo?: string | null;
};

export enum AccountType {
  BankAccount = 'bank_account',
  Jug = 'jug'
};