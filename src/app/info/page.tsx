"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
    PaginationContent,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import useLoginInfoStore from "@/store/login-info/login-info";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import { notFound } from "next/navigation";
import Spinner from "@/components/local-components/spinner";
import { LoginInfo } from "@/types/property";

export default function LoginInfoTable() {
    const { fetchLoginInfo} = useLoginInfoStore();
    const [loginInfo, setLoginInfo] = useState<LoginInfo[]>([]);
    const [isSuperUser, isSuperUserLoading] = useIsSuperUser();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [loginInfoPerPage] = useState(15);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!isSuperUserLoading && !isSuperUser) {
            notFound();
        }
    }, [isSuperUser, isSuperUserLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchLoginInfo(currentPage, loginInfoPerPage);
            if (response) {
                setLoginInfo(response.data);  // Use the data property from the response
                setTotalPages(Math.ceil(response.total / loginInfoPerPage));
            }
        };

        fetchData();
    }, [fetchLoginInfo, currentPage, loginInfoPerPage]);

    if(isSuperUserLoading) {
        return <Spinner theme="dark" />;
    }

    const paginate = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
        router.push(`?page=${pageNumber}`);
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages && totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            onClick={() => paginate(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else if (totalPages) {
            items.push(
                <PaginationItem key="page-1">
                    <PaginationLink
                        onClick={() => paginate(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(currentPage + 1, totalPages - 1);
                i++
            ) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            onClick={() => paginate(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            items.push(
                <PaginationItem key={`page-${totalPages}`}>
                    <PaginationLink
                        onClick={() => paginate(totalPages)}
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={() => router.push("/")}>Назад</Button>
                    <h2 className="text-2xl font-bold">Информация о входах</h2>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Время входа</TableHead>
                                <TableHead>Телефон</TableHead>
                                <TableHead>ID пользователя</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loginInfo && loginInfo.length > 0 ? (
                                loginInfo.map((info) => (
                                    <TableRow key={info.id}>
                                        <TableCell>{info.email}</TableCell>
                                        <TableCell>{new Date(info.login_at).toLocaleString()}</TableCell>
                                        <TableCell>{info.phone}</TableCell>
                                        <TableCell>{info.user_id}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex justify-center mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    {currentPage > 1 && (
                                        <PaginationPrevious
                                            onClick={() => paginate(currentPage - 1)}
                                        />
                                    )}
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    {currentPage < totalPages && (
                                        <PaginationNext onClick={() => paginate(currentPage + 1)} />
                                    )}
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

