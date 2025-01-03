import { IBank } from '@/lib/types/bank';
import { AccountForm } from './';


interface IBalanceSection {
  banks: IBank[]
}


export const BalanceSection: React.FC<IBalanceSection> = ({ banks }) => {
  const bankOptions = banks.map(bank => ({ value: bank.id, label: bank.name, icon: bank.logo }));

  return (
    <div className='space-y-3'>
      <div className='w-full flex justify-between items-center'>
        <h2>Your funds</h2>
        <AccountForm banks={bankOptions} />
      </div>
      <div className='flex gap-3'>
        <div>
          Total balance in USD
        </div>
        <div>
          <div className='flex items-center gap-3'>
            <h3>Your funds</h3>
            <div>Tabs: Total | Bank accounts | Cash</div>
          </div>
          <div>
            Existing accounts list
          </div>
        </div>
      </div>
    </div>
  );
};