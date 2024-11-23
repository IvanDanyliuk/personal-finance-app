import { auth } from "@/auth";
import { UserMenu } from "./user-menu";

export const Header = async () => {
  const session = await auth();
  return (
    <header className='px-3 w-full h-[80px] flex justify-between items-center'>
      <>
        {session && session.user && (
          <UserMenu 
            userId={session.user.id!}
            name={session.user.name!}
            email={session.user.email!}
            imageUrl={session.user.image!}
          />
        )}
      </>
    </header>
  );
};