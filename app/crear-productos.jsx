import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrearProducto = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    categoria: '',
    nombre: '',
    precio: '',
    cantidad: '',
    costo_unitario: '',
    inversion:'',
    ganancia: '30' // Valor por defecto del 30%
  });
  const [loading, setLoading] = useState(false);

  // Opciones de categoría
  const categorias = [
    { label: 'Seleccione una categoría', value: '' },
    { label: 'Electrónica', value: 'electronica' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Alimentos🍪', value: 'alimentos🍪' },
    { label: 'Hogar🏘️', value: 'hogar🏘️' },
    { label: 'Helados🍦', value: 'Helados🍦' },
    { label: 'Producto de limpieza🧃', value: 'Producto de limpieza🧃' }
  ];

  // Calcular precio automáticamente cuando cambia la inversión o cantidad
  useEffect(() => {
    if (formData.costo_unitario && formData.cantidad) {
      const costo_unitarioNum = parseFloat(formData.costo_unitario);
      const cantidadNum = parseInt(formData.cantidad);
      const gananciaPorcentaje = formData.ganancia ? parseFloat(formData.ganancia) : 0;

      if (!isNaN(costo_unitarioNum) && !isNaN(cantidadNum) && cantidadNum > 0) {
        const costoPorUnidad = costo_unitarioNum / cantidadNum;
        const precioFinal = gananciaPorcentaje ? 
          costoPorUnidad * (1 + gananciaPorcentaje / 100) : 
          costoPorUnidad;
        
        setFormData(prev => ({
          ...prev,
          precio: precioFinal.toFixed(2)
        }));
      }
    }
  }, [formData.costo_unitario, formData.cantidad, formData.ganancia]);

  // Manejar cambios en los inputs
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar el formulario
  const validateForm = () => {
    if (!formData.nombre || !formData.precio || !formData.cantidad || !formData.categoria || !formData.costo_unitario) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return false;
    }

    if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido y mayor a cero');
      return false;
    }

    if (isNaN(parseInt(formData.cantidad)) || parseInt(formData.cantidad) <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número válido y mayor a cero');
      return false;
    }

    if (isNaN(parseFloat(formData.costo_unitario)) || parseFloat(formData.costo_unitario) <= 0) {
      Alert.alert('Error', 'La inversión debe ser un número válido y mayor a cero');
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
      const url = `https://comunajoven.com.ve/api/registro_product?nombre=${encodeURIComponent(formData.nombre)}&precio=${formData.precio}&cantidad=${formData.cantidad}&categoria=${formData.categoria}&inversion=${formData.inversion}`;
      
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
          cantidad: '',
          costo_unitario: '',
          inversion: '',
          ganancia: '30' // Restablecer al valor por defecto
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
        placeholder="Costo total de los productos $"
        value={formData.costo_unitario}
        onChangeText={(text) => handleChange('costo_unitario', text)}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="inversion $"
        value={formData.inversion}
        onChangeText={(text) => handleChange('inversion', text)}
        keyboardType="decimal-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Cantidad de unidades"
        value={formData.cantidad}
        onChangeText={(text) => handleChange('cantidad', text)}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Porcentaje de ganancia (ej. 30) - Opcional"
        value={formData.ganancia}
        onChangeText={(text) => handleChange('ganancia', text)}
        keyboardType="decimal-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Precio por unidad $"
        value={formData.precio}
        onChangeText={(text) => handleChange('precio', text)}
        keyboardType="decimal-pad"
        editable={false}
      />
      
      <Text style={styles.helpText}>
        {formData.ganancia ? 
          `Precio calculado con ${formData.ganancia}% de ganancia` : 
          'Precio calculado sin ganancia (solo costo)'}
      </Text>
      
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
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CrearProducto;