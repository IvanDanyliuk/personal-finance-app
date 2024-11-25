import { auth } from '@/auth';
import { UserMenu, NavMenuMobile, Logo } from './';


export const Header: React.FC = async () => {
  const session = await auth();
  return (
    <header className='px-3 w-full h-[80px] flex flex-row md:flex-row-reverse justify-between items-center'>
      <div className='hidden md:block'>
        {session && session.user && (
          <UserMenu 
            userId={session.user.id!}
            name={session.user.name!}
            email={session.user.email!}
            imageUrl={session.user.image!}
          />
        )}
      </div>
      <div className='block md:hidden'>
        <Logo />
      </div>
      {
        session && session.user && (
          <NavMenuMobile 
            userName={session?.user?.name!} 
            email={session?.user?.email!} 
            userImage={session?.user?.image!} 
          />
        )
      }
    </header>
  );
};