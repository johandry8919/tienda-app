import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert,  ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useProductos } from '../assets/js/useProductos';
import { useProdu_vendido } from '../assets/js/useProdu_vendido';
import { Picker } from '@react-native-picker/picker';

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
  const [selectedCategory, setSelectedCategory] = useState('Todas');

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
  }, [fetchProductos]);




  // Calcular resumen de ventas por categoría
  const getSalesSummary = () => {
    const summary = {};
    
    productos.forEach(item => {

      
      const category = item.categoria || 'Sin categoría';
      if (!summary[category]) {
        summary[category] = {
          totalVendido: 0,
          gananciaUSD: 0,
          gananciaBS: 0,
          inversionUSD:0
        };
      }
      summary[category].totalVendido += item.total_vendido || 0;
      summary[category].gananciaUSD += (item.precio * (item.total_vendido || 0));
      summary[category].gananciaBS += (item.precio * (item.total_vendido || 0) * (tasav || 0));
      summary[category].inversionUSD = (item.inversion);
    });
    
    return summary;
  };

  const salesSummary = getSalesSummary();

  const handlevendi = (id, nombre, precio) => {
    Alert.alert(
      'Vender Producto',
      `¿Estás seguro de que se vendió el producto ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Vendido', 
          style: 'destructive',
          onPress: () => {
            produ_vendido(id, precio);
            onRefresh();
          }
        }
      ]
    );
  };

  // Obtener categorías únicas
  const getCategories = () => {
    const categories = new Set();
    productos.forEach(item => {
      categories.add(item.categoria || 'Sin categoría');
    });
    return ['Todas', ...Array.from(categories)];
  };

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory === 'Todas' 
    ? productos 
    : productos.filter(item => 
        item.categoria === selectedCategory || 
        (!item.categoria && selectedCategory === 'Sin categoría')
      );

  const renderItem = ({ 
    item: {
      id,
      nombre,
      precio,
      cantidad,
      fecha_registro,
      total_vendido,
      categoria,
      inversion
    } 
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{nombre} </Text>
      <Text style={styles.categoryText}>Categoría: {categoria || 'Sin categoría'}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Precio: ${precio.toLocaleString('es-VE')} (Costo BS {parseInt(precio * (tasav || 0))})</Text>
        <Text style={styles.detailText}>Stock: {(cantidad - total_vendido).toLocaleString()}</Text>
      </View>
      {fecha_registro && (
        <Text style={styles.dateText}>
          Registrado: {new Date(fecha_registro).toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.idText2}>Vendido: {total_vendido}</Text>
      <Text style={styles.idText2}>Ganancias Total en $: {parseFloat(precio * total_vendido).toFixed(2)}</Text>
      <Text style={styles.idText2}>Ganancias Total en BS: {Math.round(precio * total_vendido * (tasav || 0))}</Text>

      {(cantidad - total_vendido) > 0 && 
        <TouchableOpacity 
          onPress={() => handlevendi(id, nombre, precio)} 
          style={styles.actionButton}
        >
          <Icon name="credit-card" size={35} color="#3498db" />
        </TouchableOpacity>
      }
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
      <Text style={styles.title2}>Tasa de cambio del día de hoy: BS({tasav || 'cargando...'})</Text>
      <Text style={styles.title}>Mis Productos</Text>
      
      {/* Resumen de ventas por categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryContainer}>
        {Object.entries(salesSummary).map(([category, data]) => (
          <View key={category} style={styles.summaryCard}>
         
            <Text style={styles.summaryCategory}>{category}</Text>
            <Text style={styles.summaryText}>Vendidos: {data.totalVendido}</Text>
            <Text style={styles.summaryText}>Total vendido $: {( data.gananciaUSD.toFixed(2))}</Text>
            <Text style={styles.summaryText}>Inversion $: {data.inversionUSD}</Text>
            <Text  style={[styles.summaryText, { color: '#27ae60' }]}>Ganacias $: {( data.gananciaUSD - data.inversionUSD <=0? 'En proseso .. ' : data.gananciaUSD - data.inversionUSD   )}</Text>
            
            {/* <Text style={styles.summaryText}>Ganancia BS: {Math.round(data.gananciaBS)}</Text> */}
          </View>
        ))}
      </ScrollView>
      
      {/* Selector de categorías */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por categoría:</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}>
          {getCategories().map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredProducts}
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
  categoryText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
    fontStyle: 'italic',
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#34495e',
  },
  summaryContainer: {
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
   height:200,
    minWidth: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 3,
  },
});