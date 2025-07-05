

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  fecha_registro?: string;
}

export default function Home() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [tasav, setTasa] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const API_URL = 'https://comunajoven.com.ve/api/listar_productos';
    const bcv = 'https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd';
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
  
  
        const tasa = await fetch(bcv, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
  
           const BCV = await tasa.json();
  
           setTasa(BCV)
  
  
        // Primero obtenemos el texto para limpiar posibles caracteres especiales
        const responseText = await response.text();
        const cleanedResponse = responseText.trim();
        
        let data: { success: boolean; data: Producto[]; timestamp?: string } = { success: false, data: [] };
        
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


  
    const onRefresh = () => {
      setRefreshing(true);
      fetchProductos();
     
    };
  
    const renderItem = ({ item }: { item: Producto }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Precio: ${item.precio.toLocaleString('es-VE')} (BS {item.precio *tasav.price_old})</Text>
          <Text style={styles.detailText}>Cantidad: {item.cantidad.toLocaleString()}</Text>
        </View>
        {item.fecha_registro && (
          <Text style={styles.dateText}>
            Registrado: {new Date(item.fecha_registro).toLocaleDateString()}
          </Text>
        )}
        <Text style={styles.idText}>ID: {item.id}</Text>
        <Text style={styles.idText2}>Ganacias Total ${item.precio * item.cantidad} (BS:{(item.precio * item.cantidad) * tasav.price_old})</Text>
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
          <Text style={styles.retryButton} onPress={fetchProductos}>
            Reintentar
          </Text>
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
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#000',
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
  idText2: {
    fontSize: 15,
    color: 'red',
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
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
  },
});
