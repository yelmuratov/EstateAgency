import { useState, useEffect } from 'react';
import { getUser } from '@/services/authService';

export const useIsSuperUser = (): [boolean | null, boolean] => {
  const [isSuperUser, setIsSuperUser] = useState<boolean | null>(null);
  const [isSuperUserLoading, setIsSuperUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSuperUser = async () => {
      const user = await getUser();
      setIsSuperUser(user ? user.user.is_superuser : null);
      setIsSuperUserLoading(false);
    };
    checkSuperUser();
  }, []);

  return [isSuperUser, isSuperUserLoading];
};

