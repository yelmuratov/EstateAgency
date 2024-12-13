'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLandStore } from '@/store/land/landStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LandTable: React.FC = () => {
  const { lands, fetchLands, total, loading } = useLandStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchLands(page, limit);
  }, [page, fetchLands]);

  const statusColors = {
    free: 'bg-green-500',
    soon: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Превью</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Расположение</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Агент</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Площадь</TableHead>
            <TableHead>Контакты</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Загрузка...
              </TableCell>
            </TableRow>
          ) : (
            lands.map((land) => (
              <TableRow key={land.id}>
                <TableCell>
                  {land.media?.[0]?.url ? (
                    <Image
                      src={land.media[0].url}
                      alt={land.title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  ) : (
                    'Нет изображения'
                  )}
                </TableCell>
                <TableCell className="font-medium">{land.title}</TableCell>
                <TableCell>{`${land.price}$`}</TableCell>
                <TableCell>{land.location}</TableCell>
                <TableCell>{new Date(land.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{land.responsible}</TableCell>
                <TableCell>
                  <Badge className={statusColors[land.current_status as keyof typeof statusColors]}>{land.current_status}</Badge>
                </TableCell>
                <TableCell>{`${land.square_area} M2`}</TableCell>
                <TableCell>{land.responsible}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Предыдущая
        </Button>
        <span>Страница {page}</span>
        <Button onClick={() => setPage((prev) => (page * limit < total ? prev + 1 : prev))} disabled={page * limit >= total}>
          Следующая
        </Button>
      </div>
    </div>
  );
};

export default LandTable;
