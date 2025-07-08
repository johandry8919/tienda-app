import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from './hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import CustomDrawer from '../components/CustomDrawer';

export default function RootLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            animationTypeForReplace: session ? 'push' : 'pop'
          }} 
        />
      </Stack>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: true,
          swipeEnabled: true,
          headerTitleAlign: 'center',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Inicio',
            drawerLabel: 'Página Principal',
          }}
        />
        <Drawer.Screen
          name="crear-productos"
          options={{
            title: 'crear productos',
            drawerLabel: 'Nuevo Producto',
          }}
        />
        <Drawer.Screen
          name="ListarProductos"
          options={{
            title: 'Editar productos',
            drawerLabel: 'Editar productos',
          }}
        />
        <Drawer.Screen
          name="product_vendido"
          options={{
            title: 'Ganacias',
            drawerLabel: 'Ganacias',
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            title: 'Acerca de',
            drawerLabel: 'Información'
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}