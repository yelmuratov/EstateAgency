import React, { ReactNode } from "react";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
  );
};

export default DashboardLayout;
