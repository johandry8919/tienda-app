import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // Corresponde a app/index.tsx
          options={{
            title: 'Inicio', // Título en el Drawer
            drawerLabel: 'Página Principal', // Texto en el menú
          }}
        />

        <Drawer.Screen
          name="crear-productos" // Corresponde a app/index.tsx
          options={{
            title: 'crear productos', // Título en el Drawer
            drawerLabel: 'Nuevo Producto', // Texto en el menú
          }}
        />
        <Drawer.Screen
          name="ListarProductos" // Corresponde a app/index.tsx
          options={{
            title: 'Editar productos', // Título en el Drawer
            drawerLabel: 'Editar productos', // Texto en el menú
          }}
        />

        <Drawer.Screen
          name="product_vendido" // Corresponde a app/index.tsx
          options={{
            title: 'Producto Vendidos', // Título en el Drawer
            drawerLabel: 'Producto Vendidos', // Texto en el menú
          }}
        />
        {/* Otras pantallas del Drawer */}
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