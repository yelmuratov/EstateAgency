'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCommercialStore } from '@/store/commercial/commercialStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CommercialTable: React.FC = () => {
  const { commercials, fetchCommercials, total, loading } = useCommercialStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchCommercials(page, limit);
  }, [page, fetchCommercials]);

  const statusColors = {
    free: 'bg-green-500',
    soon: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  return (
    <h1>Hello world</h1>
  );
};

export default CommercialTable;
