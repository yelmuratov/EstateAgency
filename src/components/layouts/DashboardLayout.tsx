import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin dashboard template with dark and light mode',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className={`flex h-screen flex-col ${inter.className}`}>
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
        </ThemeProvider>
    );
}
