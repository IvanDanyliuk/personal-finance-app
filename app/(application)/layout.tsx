import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='flex'>
          <Sidebar />
          <div className='w-full overflow-x-auto'>
            <div className='overflow-auto'>
              <Header />
              <main>
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}