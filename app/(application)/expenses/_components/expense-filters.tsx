import { DateFilters } from '@/components/data-rendering';
import { MainFilters } from './main-filters';


export const ExpenseFilters: React.FC = () => {
  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <DateFilters />
        <MainFilters />
      </div>
    </div>
  );
};