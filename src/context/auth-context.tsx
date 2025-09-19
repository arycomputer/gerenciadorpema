'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  users: User[];
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (username: string, data: Partial<User>) => void;
  deleteUser: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'pema-users';
const AUTH_USER_STORAGE_KEY = 'pema-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize users from localStorage
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Create a default admin user if no users exist
        const defaultAdmin: User = { 
            username: 'admin', 
            password: 'admin', 
            role: 'admin',
            avatarUrl: `https://picsum.photos/seed/admin/200/200`,
            locations: ['Balcão', 'Salão', 'Delivery'],
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultAdmin]));
        setUsers([defaultAdmin]);
      }

      // Check for logged-in user in sessionStorage
      const storedUser = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse auth data from storage", error)
        // Clear corrupted storage
        localStorage.removeItem(USERS_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const persistUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  }

  const login = (username: string, pass: string) => {
    const foundUser = users.find((u) => u.username === username && u.password === pass);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password;
      sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setUser(null);
    router.replace('/login');
  };
  
  const addUser = (newUser: User) => {
    if (users.some(u => u.username === newUser.username)) {
      throw new Error('Nome de usuário já existe.');
    }
    const userWithAvatar: User = {
        ...newUser,
        avatarUrl: `https://picsum.photos/seed/${newUser.username}/200/200`,
        locations: newUser.locations || ['Balcão'],
    }
    persistUsers([...users, userWithAvatar]);
  };

  const updateUser = (username: string, data: Partial<User>) => {
    const updatedUsers = users.map(u => {
        if (u.username === username) {
            const updatedUser = { ...u, ...data };
            // If password is an empty string, don't update it
            if (data.password === '') {
                delete updatedUser.password;
            }
             // Update session storage if the currently logged-in user is being edited
            if (user && user.username === username) {
                const userToStore = { ...updatedUser };
                delete userToStore.password;
                sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userToStore));
                setUser(userToStore);
            }
            return updatedUser;
        }
        return u;
    });
    persistUsers(updatedUsers);
  };
  
  const deleteUser = (username: string) => {
    if (username === user?.username) {
        throw new Error("Não é possível excluir o usuário logado.");
    }
    const updatedUsers = users.filter(u => u.username !== username);
    persistUsers(updatedUsers);
  };


  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user, 
        isLoading, 
        user, 
        users,
        login, 
        logout,
        addUser,
        updateUser,
        deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
