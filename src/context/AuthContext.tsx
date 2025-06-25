// context/AuthContext.tsx
'use client';
import { useEffect, useState, createContext, useContext } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  location?: Location;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  updateUserLocation: (location: Location) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateUserLocation = (location: Location): void => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: 'user123',
        name: 'Alex Johnson',
        email: email,
        avatar:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80',
        isLoggedIn: true
      };

      setUser(userData);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));

        const isInIframe = window !== window.parent;

        if (!isInIframe && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              updateUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (geoError) => {
              console.error('Geolocation error:', geoError);
            }
          );
        }
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userId = 'user' + Math.random().toString(36).substr(2, 9);
      const userData: User = {
        id: userId,
        name: name,
        email: email,
        avatar:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80',
        isLoggedIn: true
      };

      setUser(userData);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        error,
        updateUserLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
