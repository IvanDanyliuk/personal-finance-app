import { Navbar } from './_components';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <Navbar />
      <div className='w-full min-h-[calc(100%-4rem)] mt-3 p-3 border border-secondary-1 rounded-xl'>
        {children}
      </div>
    </>
  );
};