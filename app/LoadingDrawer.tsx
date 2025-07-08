import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingDrawer = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Cargando menú...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingDrawer;