import { auth } from "@/auth";
import { UserMenu } from "./user-menu";

export const Header = async () => {
  const session = await auth();
  return (
    <header>
      <div>
        {session && session.user && (
          <UserMenu 
            userId={session.user.id!}
            name={session.user.name!}
            email={session.user.email!}
            imageUrl={session.user.image!}
          />
        )}
      </div>
    </header>
  );
};