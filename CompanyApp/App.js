import { StyleSheet } from 'react-native'
import { createContext, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AddVendor from './src/screens/AddVender'
import AddEmployee from './src/screens/AddEmployee'
import CompanySignIn from './src/screens/auth/CompanySignIn'
import CompanySignUp from './src/screens/auth/CompanySignUp'
import Home from './src/screens/Home'
import EmployeeDetails from './src/screens/EmployeeDetails'
import CreateCoupon from './src/screens/CreateCoupon'
import AssignCoupon from './src/screens/AssignCoupon'
import VendorDetails from './src/screens/VendorDetails'

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
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddEmployee" component={AddEmployee} />
              <Stack.Screen name="AddVendor" component={AddVendor} />
              <Stack.Screen name='EmployeeDetails' component={EmployeeDetails}/>
              <Stack.Screen name='AssignCoupon' component={AssignCoupon}/>
              <Stack.Screen name='CreateCoupon' component={CreateCoupon}/>
              <Stack.Screen name='VendorDetails' component={VendorDetails}/>
            </>
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
