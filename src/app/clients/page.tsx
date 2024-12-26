'use client'
import { useEffect, useState } from "react";
import {PropertyTable} from "@/components/clients/client-table";
import { PropertyFormData } from "@/types/property";
import { useClientStore } from "@/store/clients/useClientStore";

export default function PropertyPage() {
  const [properties, setProperties] = useState<PropertyFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchClients} = useClientStore();  

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetchClients();
      setProperties(response);
      console.log(response);
      setIsLoading(false);
    };

    fetchProperties();
  }, [fetchClients]);

  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <PropertyTable data={properties} />
      )}
    </div>
  );
}



