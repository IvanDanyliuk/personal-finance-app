import { create } from 'zustand';
import { IBankAccount } from '../types/bank';


interface BanksAccountStore {
  accounts: IBankAccount[];
  setBankAccounts: (accounts: IBankAccount[]) => void;
}

const useBankAccountsStore = create<BanksAccountStore>((set) => ({
  accounts: [],
  setBankAccounts: (accounts) => set({ accounts }),
}));

export default useBankAccountsStore;