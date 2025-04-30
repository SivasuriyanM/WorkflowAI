import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {LayoutGrid, Zap, Settings, LifeBuoy} from 'lucide-react';
import {cn} from '@/lib/utils';
import Link from 'next/link';
import {Toaster} from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FlowAI',
  description: 'AI-powered Workflow Automation Software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased font-sans`
        )}
      >
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="flex items-center justify-between p-4">
              <h1 className="text-2xl font-semibold">FlowAI</h1>
              {/* SidebarTrigger is hidden on desktop when sidebar is open */}
              <SidebarTrigger className="hidden data-[state=collapsed]:block" />
            </SidebarHeader>
            <SidebarContent className="p-4 flex flex-col gap-4">
              <Link href="/" passHref>
                <Button variant="ghost" className="justify-start w-full">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/workflows" passHref>
                <Button variant="ghost" className="justify-start w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Workflows
                </Button>
              </Link>
              <Link href="/integrations" passHref>
                <Button variant="ghost" className="justify-start w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Integrations
                </Button>
              </Link>
              <Link href="/optimize" passHref>
                <Button variant="ghost" className="justify-start w-full">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Optimize
                </Button>
              </Link>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="flex items-center p-4 border-b">
              <SidebarTrigger className="mr-4 md:hidden" />
              {/* Add potential header content here */}
            </div>
            <main className="flex-1 p-4 lg:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
