import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full overflow-x-auto min-h-screen'>
        <div className='overflow-auto h-full'>
          <Header />
          <main className='w-full min-h-[calc(100%-80px)]'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};