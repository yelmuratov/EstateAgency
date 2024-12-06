import React, { ReactNode } from 'react'
import Header from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default DashboardLayout

