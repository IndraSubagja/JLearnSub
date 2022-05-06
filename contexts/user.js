import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import GeneralContext from './general';
import Auth from '../components/Auth';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const { setLoading } = useContext(GeneralContext);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get('/api/user/me');
        setUser(data);
      } catch (error) {
        await axios.post('/api/auth/logout');
        setUser(false);
        localStorage.clear();
        sessionStorage.clear();
        router.pathname !== '/' && router.push('/');
      }

      setLoading(false);
    };

    if (user === null) {
      getUser();
    } else if (user === false && router.pathname !== '/') {
      router.push('/');
    }
  }, [user, router, setLoading]);

  useEffect(() => {
    const refreshToken = async () => {
      await axios.post('/api/auth/refresh-token');
    };
    const clearSession = () => sessionStorage.clear();

    let interval;

    if (user) {
      interval = setInterval(() => {
        refreshToken();
      }, 1000 * (60 * 10 - 10));

      window.addEventListener('beforeunload', clearSession);
    }

    return () => {
      window.removeEventListener('beforeunload', clearSession);
      clearInterval(interval);
    };
  }, [user]);

  return (
    user !== null && <UserContext.Provider value={{ user, setUser }}>{user ? children : <Auth />}</UserContext.Provider>
  );
}

export default UserContext;
