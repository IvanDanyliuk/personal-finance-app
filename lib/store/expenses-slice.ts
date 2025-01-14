import { create } from 'zustand';
import { ExpenseSchema } from '../types/form-schemas/expenses';


interface IExpense extends ExpenseSchema {
  id: string;
}

interface ExpensesStore {
  expenses: IExpense[];
  setExpenses: (expenses: IExpense[]) => void;
  addExpense: (expense: IExpense) => void;
  editExpense:(expense: IExpense) => void;
  removeExpense: (id: string) => void;
};

const useExpensesStore = create<ExpensesStore>((set) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [ ...state.expenses, expense ] })),
  editExpense: (expense) => set((state) => ({ expenses: state.expenses.map(item => item.id === expense.id ? expense : item) })),
  removeExpense: (id) => set((state) => ({ expenses: state.expenses.filter(item => item.id !== id) })),
}));

export default useExpensesStore;