import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Correct Import for Ionicons (Default export)
import { Ionicons } from '@react-native-vector-icons/ionicons'; 

// Import Screens
import Employee from './Employee';
import Vendor from './Vender';
import Dashboard from './Dashboard';
import Coupan from './Coupon'; 

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          
          // Colors
          tabBarActiveTintColor: '#4F46E5', // Indigo
          tabBarInactiveTintColor: '#9CA3AF', // Gray
          
          // Label Style
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 5,
          },

          // 👇 FLOATING TAB BAR STYLES
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,     // Float 25px from bottom
            left: 20,       // Margin from left
            right: 20,      // Margin from right
            elevation: 5,   // Android Shadow
            backgroundColor: '#ffffff',
            borderRadius: 15, // Rounded corners
            height: 70,     // Height of the floating bar
            borderTopWidth: 0, // Remove top line
            
            // iOS Shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 5, 
          },

          // Icon Logic
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Employee') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Vendor') {
              iconName = focused ? 'storefront' : 'storefront-outline';
            } else if (route.name === 'Coupan') { 
              iconName = focused ? 'ticket' : 'ticket-outline';
            }  
            
            // Ensure we have a valid icon
            return <Ionicons name={iconName || 'help-circle'} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Employee" component={Employee} />
        <Tab.Screen name="Vendor" component={Vendor} />
        <Tab.Screen name="Coupan" component={Coupan} />

      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default Home;