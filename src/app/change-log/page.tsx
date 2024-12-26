"use client"

import { useEffect, useState } from "react"
import { PropertyTable } from "@/components/change-log/property-table"
import useChangeStore from "@/store/chage-log/changeStore"
import { IChangeLog } from "@/types/property"
import Spinner from "@/components/local-components/spinner"
import { useIsSuperUser } from "@/hooks/useIsSuperUser"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"

const ITEMS_PER_PAGE = 10

export default function Page() {
  const { loading, error, fetchChangeLogs } = useChangeStore();
  const [changeLogs, setChangeLogs] = useState<IChangeLog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isSuperUser,isSuperUserLoading] = useIsSuperUser();
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchChangeLogs(currentPage, ITEMS_PER_PAGE);
      setChangeLogs(response?.data || []);
      setTotal(response?.total || 0);
    }

    fetchData()
  }, [currentPage, fetchChangeLogs])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if(isSuperUserLoading){ 
    return <Spinner theme="dark"/>
  }

  if(!isSuperUser){
    return router.push("/404");
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Лог изменений
      </h1>
      <Button onClick={() => router.back()} className="mb-4 ml-4">
          Назад
        </Button>
      <PropertyTable 
        data={changeLogs}
        isLoading={loading}
        error={error}
        page={currentPage}
        total={total}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
    </DashboardLayout>
  )
}
