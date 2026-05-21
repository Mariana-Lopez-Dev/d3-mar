import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#111827', 
            borderBottomWidth: 0, 
            shadowColor: 'transparent' 
          },
          headerTintColor: '#F9FAFB',
          headerTitleStyle: { 
            fontWeight: '800', 
            fontSize: 19, 
            letterSpacing: 0.5 
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '🌍 DESCUBRE' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: '📍 EXPLORA' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}