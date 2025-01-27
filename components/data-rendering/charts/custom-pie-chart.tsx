'use client';

import { Cell, Legend, Pie, PieChart } from 'recharts';
import { useTranslations } from 'next-intl';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { NoChartDataPlaceholder } from '@/app/(application)/analytics/_components';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ExpensesStructure, IncomeStructure } from '@/lib/types/analytics.types';


interface ICustomPieChart {
  data: IncomeStructure[] | ExpensesStructure[];
  config: ChartConfig;
  title: string;
  nameKey: string;
  noDataImage: StaticImport | string;
  noDataMessage: string;
};


export const CustomPieChart: React.FC<ICustomPieChart> = ({
  data,
  config,
  title,
  nameKey,
  noDataImage,
  noDataMessage
}) => {
  const t = useTranslations();
  
  return (
    <div className='flex-1 space-y-4'>
      <h4 className='text-lg text-center font-semibold'>
        {t(title)}
      </h4>
      {data.length > 0 ? (
        <ChartContainer config={config} className='w-full min-h-fit h-fit'>
          <PieChart className='w-52'>
            <Legend />
            <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
            <Pie 
              data={data} 
              dataKey='amount' 
              nameKey={nameKey} 
              cx='50%' 
              cy='50%' 
              innerRadius={'55%'} 
              outerRadius={'85%'} 
              label
            >
              {data.map((entry, i) => (
                <Cell key={`${entry}-${i}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      ) : (
        <NoChartDataPlaceholder 
          image={noDataImage} 
          message={noDataMessage} 
        />
      )}
    </div>
  );
};