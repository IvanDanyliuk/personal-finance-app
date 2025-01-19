import { Navbar } from "./_components";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className='space-y-3'>
      <Navbar />
      <div>
        {children}
      </div>
    </div>
  );
};