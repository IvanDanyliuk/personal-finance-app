import { Header } from '@/components/layout';
import { Sidebar } from '@/components/layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full overflow-x-auto min-h-screen'>
        <div className='h-screen'>
          <Header />
          <main className='p-3 w-full h-[calc(100%-80px)] overflow-y-scroll'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};