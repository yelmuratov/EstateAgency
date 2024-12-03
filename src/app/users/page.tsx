'use client'
import DashboardLayout from "@/components/layouts/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/local-components/spinner";

export default function UsersPage() {
    const { loading, token } = useAuth();

    if (loading) {
        return <Spinner />; // Show a spinner while checking auth
    }
    return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p>User management content goes here.</p>
      </div>
    </DashboardLayout>
    )
  }
  
  