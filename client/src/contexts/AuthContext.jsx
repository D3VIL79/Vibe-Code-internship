import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));
  const [demoProfiles, setDemoProfiles] = useState([]);

  // Fetch available demo profiles
  const fetchDemoProfiles = useCallback(async () => {
    try {
      const res = await api.get('/auth/demo-profiles');
      if (res.data && res.data.profiles) {
        setDemoProfiles(res.data.profiles);
      }
    } catch (e) {
      console.warn('Could not fetch demo profiles:', e.message);
    }
  }, []);

  // Validate active token on startup
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (isMounted) {
          setUser(res.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.warn('Failed to validate session token, reverting to guest:', error.message);
        localStorage.removeItem('token');
        if (isMounted) {
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    loadUser();
    fetchDemoProfiles();

    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, fetchDemoProfiles]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginWithDemo = async (subscriberType) => {
    const res = await api.post('/auth/demo-login', { subscriberType });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginWithGoogle = async (googleUser) => {
    const res = await api.post('/auth/google', googleUser);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      demoProfiles,
      login,
      loginWithDemo,
      loginWithGoogle,
      register,
      logout,
      fetchDemoProfiles
    }}>
      {loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-brand-500/30">
              S
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Sales<span className="text-brand-400">IQ</span>
            </span>
          </div>
          <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs text-slate-400 font-medium">Initializing Sales Intelligence...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
