// AuthProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  avatar?: string | null;
  discriminator: string;
  email?: string | null;
  provider: 'discord' | 'github';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: 'discord' | 'github') => Promise<void>;
  logout: () => void;
  loading: boolean;
  isFirstLogin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const wasFirstLogin = localStorage.getItem('isFirstLogin') === 'true';

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsFirstLogin(wasFirstLogin);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !savedUser) {
      handleDiscordCallback(code);
    } else {
      setLoading(false);
    }
  }, []);

  const handleDiscordCallback = async (code: string) => {
    try {
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: '1380603424915193876',
          client_secret: 'KvzYHZPp-VuziTG3dq3Vv-v2wNSLjZgO',
          grant_type: 'authorization_code',
          code,
          redirect_uri: window.location.origin + '/auth/discord/callback',
        }),
      });

      if (!tokenResponse.ok) throw new Error('Erro ao trocar código por token');

      const tokenData = await tokenResponse.json();

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userResponse.ok) throw new Error('Erro ao buscar dados do usuário');

      const userData = await userResponse.json();

      const discordUser: User = {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar || null,
        discriminator: userData.discriminator || '0000',
        email: userData.email || null,
        provider: 'discord',
      };

      setUser(discordUser);
      setIsFirstLogin(true);
      localStorage.setItem('user', JSON.stringify(discordUser));
      localStorage.setItem('isFirstLogin', 'true');
      window.history.replaceState({}, document.title, '/');
      setTimeout(() => window.dispatchEvent(new CustomEvent('userCreated')), 1000);
    } catch (error) {
      console.error('Erro no callback do Discord:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (provider: 'discord' | 'github') => {
    setLoading(true);
    if (provider === 'discord') {
      const clientId = '1380603424915193876';
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/discord/callback');
      const scope = encodeURIComponent('identify email');
      const state = Math.random().toString(36).substring(7);
      const authUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
    } else {
      const mockUser: User = {
        id: '12345',
        username: 'DevUser',
        avatar: null,
        discriminator: '0000',
        email: 'user@example.com',
        provider: 'github',
      };
      setUser(mockUser);
      setIsFirstLogin(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isFirstLogin', 'true');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsFirstLogin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isFirstLogin');
  };

  useEffect(() => {
    if (isFirstLogin && user) {
      const timer = setTimeout(() => {
        setIsFirstLogin(false);
        localStorage.removeItem('isFirstLogin');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFirstLogin, user]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading, isFirstLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
