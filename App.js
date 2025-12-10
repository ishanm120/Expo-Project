import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import { useColorScheme } from 'react-native';
import Color from './src/constraints/Color';

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const ColorsBasedOnThem = colorScheme === 'dark' ? Color.Dark : Color.Light;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: ColorsBasedOnThem.Header_Fooler_Background_Color, },
        headerTintColor: ColorsBasedOnThem.Header_Text_Color
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Image Listing" }} />
        <Stack.Screen name="Details" component={DetailScreen} options={{ title: "Detail Screen" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
