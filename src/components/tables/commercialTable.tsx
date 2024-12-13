import React, { useEffect, useState } from "react";
import { useCommercialStore } from "@/store/commercial/commercialStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: { [key: string]: string } = {
  free: "bg-green-500",
  soon: "bg-yellow-500",
  busy: "bg-red-500",
};

const CommercialTable: React.FC = () => {
  const { commercials, fetchCommercials, total, loading } = useCommercialStore();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    fetchCommercials(page, limit);
  }, [page, fetchCommercials]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (commercials.length === 0) {
    return <div>No commercial properties available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsible</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commercials.map((commercial) => (
            <TableRow key={commercial.id}>
              <TableCell>{commercial.title}</TableCell>
              <TableCell>{commercial.price}$</TableCell>
              <TableCell>{commercial.location}</TableCell>
              <TableCell>{commercial.house_condition}</TableCell>
              <TableCell>
                <Badge className={statusColors[commercial.current_status]}>
                  {commercial.current_status}
                </Badge>
              </TableCell>
              <TableCell>{commercial.responsible}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: Math.ceil(total / limit) }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 ${
              page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommercialTable;
