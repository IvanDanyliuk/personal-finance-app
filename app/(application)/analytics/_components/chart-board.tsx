'use client'

import { DateFilters } from "@/components/data-rendering";

export const ChartBoard: React.FC = () => {
  return (
    <div>
      <DateFilters />
      <div>
        Cash Flow
      </div>
      <div>
        Income dynamic
      </div>
      <div>
        Expenses dynamic
      </div>
      <div>
        Income structure
      </div>
      <div>
        Expenses structure
      </div>
    </div>
  );
};