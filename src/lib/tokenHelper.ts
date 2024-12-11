export const getAuthToken = (): string | null => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1]
  
    return token || null
}

export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; secure`;
}

  
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;';
};