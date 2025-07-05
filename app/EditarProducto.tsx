import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  EditarProducto: {
    producto: Producto;
    onSave: (producto: Producto) => Promise<void>;
  };
};

const EditarProducto = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EditarProducto'>>();
  const navigation = useNavigation();
  const { producto, onSave } = route.params;

  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    precio: producto.precio.toString(),
    cantidad: producto.cantidad.toString()
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      // Validación básica
      if (!formData.nombre || !formData.precio || !formData.cantidad) {
        Alert.alert('Error', 'Todos los campos son requeridos');
        return;
      }

      if (isNaN(Number(formData.precio)) || isNaN(Number(formData.cantidad))) {
        Alert.alert('Error', 'Precio y cantidad deben ser números válidos');
        return;
      }

      setLoading(true);
      
      // Preparar datos para guardar
      const productoEditado = {
        ...producto,
        nombre: formData.nombre,
        precio: Number(formData.precio),
        cantidad: Number(formData.cantidad)
      };

      // Llamar a la función onSave proporcionada
      await onSave(productoEditado);

    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
      
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={formData.nombre}
        onChangeText={(text) => setFormData({...formData, nombre: text})}
        placeholder="Nombre del producto"
      />
      
      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={formData.precio}
        onChangeText={(text) => setFormData({...formData, precio: text})}
        keyboardType="decimal-pad"
        placeholder="Precio"
      />
      
      <Text style={styles.label}>Cantidad:</Text>
      <TextInput
        style={styles.input}
        value={formData.cantidad}
        onChangeText={(text) => setFormData({...formData, cantidad: text})}
        keyboardType="numeric"
        placeholder="Cantidad"
      />
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditarProducto;