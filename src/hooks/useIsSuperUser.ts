import { useState, useEffect } from 'react';
import { getUser } from '@/services/authService';

export const useIsSuperUser = (): [boolean | null, boolean] => {
  const [isSuperUser, setIsSuperUser] = useState<boolean | null>(null);
  const [isSUperUserloading, setIsSuperUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSuperUser = async () => {
      const user = await getUser();
      console.log('user:', user?.user?.is_superuser);
      setIsSuperUser(user?.user?.is_superuser || false);
      setIsSuperUserLoading(false);
    };
    checkSuperUser();
  }, []);

  return [isSuperUser, isSUperUserloading];
};

