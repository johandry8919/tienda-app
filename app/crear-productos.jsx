import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrearProducto = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    categoria: '',
    nombre: '',
    precio: '',
    cantidad: ''
  });
  const [loading, setLoading] = useState(false);

  // Opciones de categoría
  const categorias = [
    { label: 'Seleccione una categoría', value: '' },
    { label: 'Electrónica', value: 'electronica' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Alimentos', value: 'alimentos' },
    { label: 'Hogar', value: 'hogar' },
    { label: 'Helados', value: 'Helados' },
    { label: 'Producto de limpieza', value: 'Producto de limpieza' }
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

  // Enviar el formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = '5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac';
      const url = `https://comunajoven.com.ve/api/registro_product?nombre=${encodeURIComponent(formData.nombre)}&precio=${formData.precio}&cantidad=${formData.cantidad}&categoria=${formData.categoria}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
      });

      if (response.status === 401) {
        Alert.alert('Error', 'Token inválido o expirado');
        return;
      }

      if (response.status === 400) {
        Alert.alert('Error', 'Token no proporcionado o formato incorrecto');
        return;
      }

      const responseText = await response.text();
      
      if (response.ok && responseText) {
        Alert.alert('Éxito', 'Producto registrado correctamente');
        // Resetear formulario
        setFormData({
          categoria: '',
          nombre: '',
          precio: '',
          cantidad: ''
        });
      } else {
        Alert.alert('Error', 'Error al registrar el producto');
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Producto</Text>
      
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
});

export default CrearProducto;