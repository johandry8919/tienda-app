import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '../app/(hooks)/useAuth';

export default function CustomDrawer(props: any) {
  const { session, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi bodega </Text>
        <Text style={styles.subtitle}>{session?.email}</Text>
      </View>

      <DrawerItem
        label="Inicio"
        onPress={() => props.navigation.navigate('index')}
        labelStyle={styles.label}
      />
      <DrawerItem
        label="Crear Productos"
        onPress={() => props.navigation.navigate('crear-productos')}
        labelStyle={styles.label}
      />


      <DrawerItem
        label="Editar productos"
        onPress={() => props.navigation.navigate('ListarProductos')}
        labelStyle={styles.label}
      />
      {/* Agrega más items según necesites */}

      <TouchableOpacity 
        onPress={signOut}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});