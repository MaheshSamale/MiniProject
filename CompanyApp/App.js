import { StyleSheet } from 'react-native'
import { createContext, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import CompanySignIn from './src/screens/auth/CompanySignIn'
import CompanySignUp from './src/screens/auth/CompanySignUp'
import Home from './src/screens/Home'

export const CompanyContext = createContext()

const Stack = createNativeStackNavigator()

export default function App() {
  const [company, setcompany] = useState(null)

  return (
    <CompanyContext.Provider value={{ company, setcompany }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!company ? (
            <>
              <Stack.Screen name="CompanySignIn" component={CompanySignIn} />
              <Stack.Screen name="CompanySignUp" component={CompanySignUp} />
            </>
          ) : (
            <Stack.Screen name="Home" component={Home} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </CompanyContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
