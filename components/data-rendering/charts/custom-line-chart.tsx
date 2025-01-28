'use client';

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslations } from 'next-intl';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { NoChartDataPlaceholder } from '@/app/(application)/analytics/_components';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { FundsData } from '@/lib/types/analytics.types';


interface ICustomLineChart {
  data: FundsData[];
  config: ChartConfig;
  title: string;
  dataKeys: string[];
  fillColors: string[];
  noDataImage: StaticImport | string;
  noDataMessage: string;
};


export const CustomLineChart: React.FC<ICustomLineChart> = ({
  data,
  config,
  title,
  dataKeys,
  fillColors,
  noDataImage,
  noDataMessage
}) => {
  const t = useTranslations();

  return (
    <div className='flex-1 space-y-4'>
      <h2 className='mb-3 text-base text-center font-semibold'>
        {t(title)}
      </h2>
      {data.length > 0 ? (
        <ChartContainer config={config} className='h-96 min-w-full'>
          <LineChart 
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip payload={dataKeys.map((item, i) => ({
              name: data[i].month,
              value: data[i].value
            }))} />
            <Legend payload={dataKeys.map((item, i) => ({ 
                value: dataKeys.length > 1 ? item : t(title), 
                type: 'line', 
                color: fillColors[i] 
              }))} 
            />
            {dataKeys.map((item, i) => (
              <Line 
                key={crypto.randomUUID()} 
                type='monotone' 
                dataKey={item} 
                stroke={fillColors[i]} />
            ))}
          </LineChart>
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