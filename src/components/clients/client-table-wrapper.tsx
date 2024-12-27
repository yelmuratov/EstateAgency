'use client';

import { useEffect, useState } from "react";
import { ClientsTable } from "@/components/clients/client-table";
import { PropertyFormData } from "@/types/property";
import { useClientStore } from "@/store/clients/useClientStore";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ClientTableWrapperProps {
  type: "rent" | "sale";
}

const ClientTableWrapper: React.FC<ClientTableWrapperProps> = ({ type }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchClients, clients: storeClients, error } = useClientStore();
  const { toast } = useToast();
  const [clients, setClients] = useState<PropertyFormData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetchClients(type);
      setClients(response.clients);
      setTotal(response.total);
      setIsLoading(false);
    };

    fetchProperties();
  }, [fetchClients, type]);

  useEffect(() => {
    setClients(storeClients);
  }, [storeClients]);

  useEffect(() => {
    setTotalPages(Math.ceil(total / clientsPerPage));
  }, [total, clientsPerPage]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = (
      <PaginationItem key="ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => paginate(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => paginate(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(ellipsis);
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
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
        items.push(ellipsis);
      }

      items.push(
        <PaginationItem key={totalPages}>
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
    <div className="container mx-auto py-10">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ClientsTable data={currentClients} />
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
        </>
      )}
    </div>
  );
};

export default ClientTableWrapper;
