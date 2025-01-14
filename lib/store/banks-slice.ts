import { create } from 'zustand';
import { BankSchema } from '../types/form-schemas/admin';

interface IBank extends BankSchema {
  id: string;
};

interface BanksStore {
  banks: IBank[];
  setBanks: (banks: IBank[]) => void;
}

const useBanksStore = create<BanksStore>((set) => ({
  banks: [],
  setBanks: (banks) => set({ banks }),
}));

export default useBanksStore;