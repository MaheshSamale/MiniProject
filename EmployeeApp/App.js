
import { StyleSheet, Text, View } from 'react-native';
import { createContext, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home';
import EmployeeLogin from './src/screens/auth/EmployeeLogin';


export const EmployeeContext = createContext()

const Stack = createNativeStackNavigator()

export default function App() {
    const [employee, setEmployee] = useState(null)

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!employee ? (
            <>
              <Stack.Screen name="EmployeeLogin" component={EmployeeLogin} />
              
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={Home} />
              {/* <Stack.Screen name="Home" component={Home} /> */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </EmployeeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
