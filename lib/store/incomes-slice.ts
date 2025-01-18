import { create } from 'zustand';
import { IncomeSchema } from '../types/form-schemas/incomes';


interface IIncome extends IncomeSchema {
  id: string;
}

interface IncomesStore {
  incomes: IIncome[];
  setIncomes: (incomes: IIncome[]) => void;
  addIncome: (income: IIncome) => void;
  editIncome:(income: IIncome) => void;
  removeIncome: (id: string) => void;
};

const useIncomesStore = create<IncomesStore>((set) => ({
  incomes: [],
  setIncomes: (incomes) => set({ incomes }),
  addIncome: (income) => set((state) => ({ incomes: [ ...state.incomes, income ] })),
  editIncome: (income) => set((state) => ({ incomes: state.incomes.map(item => item.id === income.id ? income : item) })),
  removeIncome: (id) => set((state) => ({ incomes: state.incomes.filter(item => item.id !== id) })),
}));

export default useIncomesStore;