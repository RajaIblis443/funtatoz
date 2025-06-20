import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setAuthCookie = (value: string, days: number = 7) => {
  cookies.set('auth_token', value, { 
    path: '/',
    maxAge: days * 24 * 60 * 60 // 7 hari
  });
};

export const getAuthCookie = (): string | null => {
  return cookies.get('auth_token') || null;
};

export const removeAuthCookie = () => {
  cookies.remove('auth_token', { path: '/' });
};