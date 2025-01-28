'use client';

import { useTranslations } from 'next-intl';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis 
} from 'recharts';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { NoChartDataPlaceholder } from '@/app/(application)/analytics/_components';
import { 
  ChartConfig,
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { CashFlow, FundsData } from '@/lib/types/analytics.types';


interface IBarChart {
  data: CashFlow[] | FundsData[];
  config: ChartConfig;
  title: string;
  dataKeys: string[];
  fillColors: string[];
  noDataImage: StaticImport | string;
  noDataMessage: string;
};


export const CustomBarChart: React.FC<IBarChart> = ({
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
    <div className='flex-1 overflow-x-auto'>
      <h4 className='text-lg text-center font-semibold'>
        {t(title)}
      </h4>
      {data.length > 0 ? (
        <ChartContainer config={config} className='h-96 min-w-full'>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent className='w-36' />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((item, i) => (
              <Bar 
                key={crypto.randomUUID()} 
                dataKey={item} 
                fill={fillColors[i] || 'hsl(var(--primary-7))'} 
                radius={4} 
              />
            ))}
          </BarChart>
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