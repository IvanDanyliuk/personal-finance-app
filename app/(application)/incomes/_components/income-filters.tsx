import { DateFilters, MainFilters } from './';


export const IncomeFilters: React.FC = () => {
  return (
    <div className='flex gap-3'>
      <div className='flex gap-2'>
        <DateFilters />
        <MainFilters />
      </div>
    </div>
  );
};