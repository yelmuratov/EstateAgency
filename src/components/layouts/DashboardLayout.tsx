import React, { ReactNode } from "react";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: ReactNode;
  type: string;
  action_type: "rent" | "sale";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children,action_type,type }) => {
  return (
      <div className="min-h-screen bg-background text-foreground">
        <Header action_type={action_type} type={type} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
  );
};

export default DashboardLayout;
