import { StyleSheet } from 'react-native';
import { createContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import VendorLogin from './src/screens/auth/VendorLogin';
import Home from './src/screens/Home';

export const VendorContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
    const [vendor, setVendor] = useState(null);

    return (
        <VendorContext.Provider value={{ vendor, setVendor }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!vendor ? (
                        <Stack.Screen name="VendorLogin" component={VendorLogin} />
                    ) : (
                        <Stack.Screen name="Home" component={Home} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </VendorContext.Provider>
    );
}