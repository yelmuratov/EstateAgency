'use client'

import DashboardLayout from "@/components/layouts/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/local-components/spinner";

export default function DistrictsPage() {
    const { loading, token } = useAuth();

    if (loading) {
        return <Spinner />; // Show a spinner while checking auth
    }
    return (
      <DashboardLayout>
        <div>
        <h1 className="text-2xl font-bold mb-4">Districts</h1>
        <p>District management content goes here.</p>
      </div>
      </DashboardLayout>
    )
  }