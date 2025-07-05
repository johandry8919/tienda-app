import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CrearProducto = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validación de campos
    if (!nombre || !precio || !cantidad) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    if (isNaN(parseFloat(precio)) || isNaN(parseInt(cantidad))) {
      Alert.alert('Error', 'Precio y cantidad deben ser números válidos');
      return;
    }

    setLoading(true);

    try {
      // Obtener el token de AsyncStorage
      const token = '5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac';


      const url = `https://comunajoven.com.ve/api/registro_product?nombre=${encodeURIComponent(nombre)}&precio=${precio}&cantidad=${cantidad}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
      });

      // Verificar primero el estado de la respuesta
      if (response.status === 401) {
        Alert.alert('Error', 'Token inválido o expirado');
        return;
      }

      if (response.status === 400) {
        Alert.alert('Error', 'Token no proporcionado o formato incorrecto');
        return;
      }

      const responseText = await response.text();


      console.log(responseText)
      let data = {};
      
  

      if (response.ok && responseText) {
        Alert.alert('Éxito', 'Producto registrado correctamente');
        setNombre('');
        setPrecio('');
        setCantidad('');
      } else {
        Alert.alert('Error', data.error || 'Error al registrar el producto');
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
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
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
});

export default CrearProducto;