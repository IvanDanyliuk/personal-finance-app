import { UserMenu, NavMenuMobile, Logo } from './';


export const Header: React.FC = () => {
  return (
    <header className='px-3 w-full h-[80px] flex flex-row md:flex-row-reverse justify-between items-center'>
      <div className='hidden md:block'>
        <UserMenu />
      </div>
      <div className='block md:hidden'>
        <Logo />
      </div>
      <NavMenuMobile />
    </header>
  );
};