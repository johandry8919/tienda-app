import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface User {
  email: string;
  name?: string;
}

export function useAuth() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const user = await SecureStore.getItemAsync('user');
        if (user) {
          setSession(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulación de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'bodega.com' && password === '123456') {
        const user = { email, name: 'Administrador' };
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        setSession(user);
        router.replace('/');
        return user;
      }
      throw new Error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setSession(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return {
    session,
    loading,
    signIn,
    signOut,
  };
}