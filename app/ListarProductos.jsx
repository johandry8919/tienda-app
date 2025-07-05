import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = 'https://comunajoven.com.ve/api/listar_productos';
  const TOKEN = '5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac';

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const responseText = await response.text();
      const cleanedResponse = responseText.trim();
      
      let data = { success: false, data: [] };
      
      if (cleanedResponse) {
        data = JSON.parse(cleanedResponse);
      }

      if (!response.ok || !data.success) {
        throw new Error('Error al obtener los productos');
      }

      setProductos(data.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error de conexión');
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (producto) => {
    Alert.alert(
      'Editar Producto',
      `¿Deseas editar ${producto.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => editarProducto(producto.id) }
      ]
    );
  };

  const handleEliminar = (id, nombre) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => eliminarProducto(id) 
        }
      ]
    );
  };

  const editarProducto = async (id) => {
    try {
      console.log('Editar producto con ID:', id);
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const response = await fetch(`https://comunajoven.com.ve/api/eliminar_producto/?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Producto eliminado correctamente');
        fetchProductos();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
      console.error('Error al eliminar:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProductos();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleEditar(item)} style={styles.actionButton}>
            {/* <Icon name="edit" size={20} color="#3498db" /> */}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleEliminar(item.id, item.nombre)} 
            style={styles.actionButton}
          >
            <Icon name="delete" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Precio: ${item.precio.toLocaleString('es-VE')}</Text>
        <Text style={styles.detailText}>Cantidad: {item.cantidad.toLocaleString()}</Text>
      </View>
      
      {item.fecha_registro && (
        <Text style={styles.dateText}>
          Registrado: {new Date(item.fecha_registro).toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.idText}>ID: {item.id}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProductos} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Registrados</Text>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']}
            tintColor="#0000ff"
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No hay productos registrados</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#34495e',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListaProductos;