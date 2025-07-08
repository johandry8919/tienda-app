import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function RootLayout() {
 

 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        
        screenOptions={{
          headerShown: true,
          swipeEnabled: false,
          
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