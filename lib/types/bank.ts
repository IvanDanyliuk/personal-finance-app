export interface IBank {
  id: string;
  name: string;
  country: string;
  logo: string;
}

export enum AccountType {
  BankAccount = 'bank_account',
  Jug = 'jug'
};