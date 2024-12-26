import { DateFilters } from '@/components/data-rendering';


export const ExpenseFilters: React.FC = () => {
  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <DateFilters />
      </div>
    </div>
  );
};