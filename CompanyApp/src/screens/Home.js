import { StyleSheet, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import Employee from './Employee';
import Vendor from './Vender';
import Dashboard from './Dashboard';

const Tab = createBottomTabNavigator()

function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName

            switch (route.name) {
              case 'Dashboard':
                iconName = 'list-outline'
                break
              case 'Employee':
                iconName = 'add-circle-outline'
                break
              case 'Vendor':
                iconName = 'grid-outline'
                break
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#0b6ffd',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Employee" component={Employee} />
        <Tab.Screen name="Vendor" component={Vendor} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Home
