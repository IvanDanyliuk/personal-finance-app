export enum ActionStatus {
  Success = 'Success',
  Failed = 'Failed'
};

export enum SortOrder {
  Desc = 'desc',
  Asc = 'asc'
};

export enum EntityTypes {
  Incomes = 'incomes',
  Expenses = 'expenses'
};

export type ColType = {
  name: string;
  label: string;
  value: string;
  isSortable: boolean;
};