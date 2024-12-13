import React, { useEffect, useState } from "react";
import { useLandStore } from "@/store/land/landStore";
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

const LandTable: React.FC = () => {
  const { lands, fetchLands, total, loading } = useLandStore();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    fetchLands(page, limit);
  }, [page, fetchLands]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (lands.length === 0) {
    return <div>No lands available.</div>;
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
          {lands.map((land) => (
            <TableRow key={land.id}>
              <TableCell>{land.title}</TableCell>
              <TableCell>{land.price}$</TableCell>
              <TableCell>{land.location}</TableCell>
              <TableCell>{land.house_condition}</TableCell>
              <TableCell>
                <Badge className={statusColors[land.current_status]}>
                  {land.current_status}
                </Badge>
              </TableCell>
              <TableCell>{land.responsible}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
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

export default LandTable;
