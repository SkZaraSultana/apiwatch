import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getProfile,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  type AuthUser,
} from "../services/authService";
import { setAccessTokenGetter } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socketClient";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<string>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    try {
      const refreshed = await refreshUserToken();
      setAccessToken(refreshed.accessToken);
      setUser(refreshed.user);
    } catch (_error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setAccessTokenGetter(() => accessToken);
  }, [accessToken]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await loginUser(payload);
    setAccessToken(response.accessToken);
    setUser(response.user);
    // connect socket after login
    try {
      connectSocket();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Socket connect failed on login:", err);
    }
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const response = await registerUser(payload);
      setAccessToken(response.accessToken);
      setUser(response.user);
      return response.message;
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setAccessToken(null);
    setUser(null);
    // disconnect socket on logout
    try {
      disconnectSocket();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Socket disconnect failed on logout:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      register,
      logout,
    }),
    [user, accessToken, loading, login, register, logout]
  );

  useEffect(() => {
    const syncProfile = async () => {
      if (!accessToken || user) return;
      try {
        const currentUser = await getProfile(accessToken);
        setUser(currentUser);
      } catch (_error) {
        setAccessToken(null);
      }
    };

    syncProfile();
  }, [accessToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
