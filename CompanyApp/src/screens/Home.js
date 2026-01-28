import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons'

// Import Screens
import Employee from './Employee';
import Vendor from './Vender';
import Dashboard from './Dashboard';

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true, // Hides tab bar when typing
          tabBarShowLabel: true,
          
          // Active/Inactive Colors
          tabBarActiveTintColor: '#4F46E5', // Indigo
          tabBarInactiveTintColor: '#9CA3AF', // Gray
          
          // Text Styling
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 5,
          },

          // Standard Bottom Bar Style
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 80, // Slightly taller for better touch targets
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6', // Subtle separator line
            paddingBottom: 15, // Spacing from bottom
            paddingTop: 8,    // Spacing from top of bar
            elevation: 8,     // Subtle shadow for Android
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },

          // Icon Configuration
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Employee') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Vendor') {
              iconName = focused ? 'storefront' : 'storefront-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Employee" component={Employee} />
        <Tab.Screen name="Vendor" component={Vendor} />
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