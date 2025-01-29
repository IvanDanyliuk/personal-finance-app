import Image from 'next/image';
import { ArrowRightLeft, ChartNoAxesCombined, Goal, Wallet } from 'lucide-react';
import { Chip } from './chip';
import AuthImage from '@/public/images/investment.svg';


export const DecorChips: React.FC = () => {
  return (
    <div className='relative w-full h-full flex justify-center items-center'>
      <Image 
        src={AuthImage}
        alt='image'
        width={500}
        height={500}
      />
      <Chip 
        icon={<Wallet />} 
        label='Auth.authChips.manageFinances' 
        className='absolute top-10 left-10'
      />
      <Chip 
        icon={<ArrowRightLeft />} 
        label='Auth.authChips.trackTransactions' 
        className='absolute top-24 right-6'
      />
      <Chip 
        icon={<ArrowRightLeft />} 
        label='Auth.authChips.createBudgets' 
        className='absolute bottom-16 right-16'
      />
      <Chip 
        icon={<Goal />} 
        label='Auth.authChips.achieveGoals' 
        className='absolute bottom-36 left-28'
      />
      <Chip 
        icon={<ChartNoAxesCombined />} 
        label='Auth.authChips.viewAnalytics' 
        className='absolute top-44 left-56'
      />
    </div>
  );
};