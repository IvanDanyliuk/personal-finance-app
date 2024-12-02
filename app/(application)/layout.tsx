import { SessionProvider } from 'next-auth/react';
import { Header } from '@/components/layout';
import { Sidebar } from '@/components/layout';
import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await auth();
  return (
    <SessionProvider session={authData}>
      <div className='flex'>
        <Sidebar />
        <div className='w-full overflow-x-auto min-h-screen'>
          <div className='overflow-auto h-full'>
            <Header />
            <main className='p-3 w-full min-h-[calc(100%-80px)]'>
              {children}
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};