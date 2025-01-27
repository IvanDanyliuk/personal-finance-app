'use client';

import { useTranslations } from 'next-intl';

interface IKeyIndicatorsSection {
  data: any;
};


export const KeyIndicatorsSection: React.FC<IKeyIndicatorsSection> = ({ data }) => {
  const t = useTranslations();
  
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
};