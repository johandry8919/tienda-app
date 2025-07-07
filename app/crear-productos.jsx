import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CrearProducto = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    categoria: '',
    nombre: '',
    precio: '',
    cantidad: ''
  });
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  // Cargar productos al iniciar
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosGuardados = await AsyncStorage.getItem('productos');
        if (productosGuardados) {
          setProductos(JSON.parse(productosGuardados));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    
    cargarProductos();
  }, []);

  // Opciones de categoría
  const categorias = [
    { label: 'Seleccione una categoría', value: '' },
    { label: 'Electrónica', value: 'electronica' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Alimentos', value: 'alimentos🍪' },
    { label: 'Hogar', value: 'hogar🏘️' },
    { label: 'Helados', value: 'Helados🍦' },
    { label: 'Producto de limpieza', value: 'Producto de limpieza🧃' }
  ];

  // Manejar cambios en los inputs
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar el formulario
  const validateForm = () => {
    if (!formData.nombre || !formData.precio || !formData.cantidad || !formData.categoria) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return false;
    }

    if (isNaN(parseFloat(formData.precio))) {
      Alert.alert('Error', 'El precio debe ser un número válido');
      return false;
    }

    if (isNaN(parseInt(formData.cantidad))) {
      Alert.alert('Error', 'La cantidad debe ser un número válido');
      return false;
    }

    return true;
  };

  // Guardar producto en el almacenamiento local
  const guardarProductoLocal = async () => {
    try {
      const nuevoProducto = {
        id: Date.now().toString(),
        ...formData,
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        fechaRegistro: new Date().toISOString()
      };

      const nuevosProductos = [...productos, nuevoProducto];
      
      await AsyncStorage.setItem('productos', JSON.stringify(nuevosProductos));
      setProductos(nuevosProductos);
      
      Alert.alert('Éxito', 'Producto registrado correctamente en el dispositivo');
      
      // Resetear formulario
      setFormData({
        categoria: '',
        nombre: '',
        precio: '',
        cantidad: ''
      });
      
      return true;
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el producto en el dispositivo');
      return false;
    }
  };

  // Enviar el formulario (ahora guarda localmente)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    await guardarProductoLocal();
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Producto (Local)</Text>
      
      {/* Select de categoría */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.categoria}
          onValueChange={(value) => handleChange('categoria', value)}
          style={styles.picker}
        >
          {categorias.map((cat, index) => (
            <Picker.Item key={index} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={formData.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Precio por unidad $"
        value={formData.precio}
        onChangeText={(text) => handleChange('precio', text)}
        keyboardType="decimal-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        value={formData.cantidad}
        onChangeText={(text) => handleChange('cantidad', text)}
        keyboardType="numeric"
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Registrar Producto"
          onPress={handleSubmit}
          disabled={loading}
        />
      )}
      
      <Text style={styles.infoText}>
        {productos.length} productos registrados localmente
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  pickerItem: {
    fontSize: 16,
    color: '#000000',
  },
  infoText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default CrearProducto;