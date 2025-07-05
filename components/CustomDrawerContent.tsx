import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mi App</Text>
      </View>
      <DrawerItem
        label="Inicio"
        onPress={() => props.navigation.navigate('index')}
      />
      <DrawerItem
        label="Acerca de"
        onPress={() => props.navigation.navigate('about')}
      />
    </DrawerContentScrollView>
  );
}