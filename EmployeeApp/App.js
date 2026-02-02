import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // 1. Import Provider
import { EmployeeProvider, EmployeeContext } from './src/context/EmployeeContext';

// Import Screens
import Home from './src/screens/Home';
import EmployeeLogin from './src/screens/auth/EmployeeLogin';
import ConfirmRedemption from './src/screens/ConfirmRedemption';
import SuccessScreen from './src/screens/SuccessScreen';
import TransactionHistory from './src/screens/TransactionHistory'; // 2. Import History Screen

const Stack = createNativeStackNavigator();

function RootStack() {
  const { employee } = useContext(EmployeeContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!employee ? (
        <Stack.Screen name="EmployeeLogin" component={EmployeeLogin} />
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen 
            name="ConfirmRedemption" 
            component={ConfirmRedemption} 
            options={{ 
                headerShown: true, 
                title: 'Redeem Coupons',
                headerStyle: { backgroundColor: '#4F46E5' },
                headerTintColor: '#fff'
            }}
          />
          <Stack.Screen 
            name="SuccessScreen" 
            component={SuccessScreen} 
            options={{ gestureEnabled: false }} 
          />
          {/* 3. Register TransactionHistory here */}
          <Stack.Screen 
            name="TransactionHistory" 
            component={TransactionHistory} 
            options={{ 
                headerShown: true, 
                title: 'My Transactions',
                headerStyle: { backgroundColor: '#FFF' },
                headerTintColor: '#1E293B',
                headerShadowVisible: false // Keeps the clean UI look
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider> 
      <EmployeeProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </EmployeeProvider>
    </SafeAreaProvider>
  );
}