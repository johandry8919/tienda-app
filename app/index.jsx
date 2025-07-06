import { useFocusEffect } from '@react-navigation/native';
import React, {  useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useProductos } from '../assets/js/useProductos';
import { useProdu_vendido } from '../assets/js/useProdu_vendido';

export default function Home() {
  const {
        productos,
        tasav,
        refreshing,
        error,
        loading,
        setRefreshing,
        setLoading,
        fetchProductos
    } = useProductos();
   

     const { produ_vendido } = useProdu_vendido();

    useEffect(() => {
      fetchProductos();
    }, [fetchProductos]);

    // Refresco automático al enfocar la pantalla
    useFocusEffect(
      useCallback(() => {
        if (!loading) {
          setRefreshing(true);
          fetchProductos();
         
        }
      }, [fetchProductos, loading])
    );

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchProductos();
    }, [fetchProductos  ]);

    const handlevendi =  (id, nombre,precio) => {
      Alert.alert(
        'Vender Producto',
        `¿Estás seguro de que se vendió el producto ${nombre}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Vendido', 
            style: 'destructive',
            onPress: () => {
               produ_vendido(id , precio)
               onRefresh()
                Alert.alert('Producto vendido con éxito')
            }
          }
        ]
      );
    };

  
  
    const renderItem = ({ 
      item: {
        id,
        nombre,
        precio,
        cantidad,
        fecha_registro,
        total_vendido
      } 
    }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.productName}>{nombre}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Precio: ${precio.toLocaleString('es-VE')} ( Costo BS {parseInt(precio * (tasav || 0))})</Text>
          <Text style={styles.detailText}>Cantidad  {cantidad.toLocaleString() - total_vendido}</Text>

         
        </View>
        {fecha_registro && (
          <Text style={styles.dateText}>
            Registrado: {new Date(fecha_registro).toLocaleDateString()}
          </Text>
        )}
        {/* <Text style={styles.idText}>ID: {id}</Text> */}
        
        <Text style={styles.idText2}>Vendido: {total_vendido}  </Text>
        <Text style={styles.idText2}>Ganancias Total en  ${parseInt(precio * total_vendido)} </Text>
        <Text style={styles.idText2}>Ganancias Total en BS: ({parseFloat(parseInt(precio * total_vendido) * (tasav|| 0))}) </Text>

         {cantidad.toLocaleString() - total_vendido != 0 && 
         <TouchableOpacity 
          onPress={() => handlevendi(id, nombre ,precio)} 
          style={styles.actionButton}
        >
          <Icon name="credit-card" size={35} color="#3498db" />
        </TouchableOpacity>
         }
        
      </View>
    );
  
    if (loading && !refreshing ) {
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
          <TouchableOpacity onPress={() => {
            setLoading(true);
            fetchProductos();
          }}>
            <Text style={styles.retryButton}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title2}>Tasa de cambio del día de hoy: BS({tasav|| 'cargando...'})</Text>
        <Text style={styles.title}>Mis Productos</Text>
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
}

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
  actionButton: {
    padding: 4,
    alignSelf: 'flex-end',
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
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#34495e',
  },
  title2: {
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 1,
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