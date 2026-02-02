import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import Dashboard from './Dashboard'; 
import Scan from './Scan';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { 
            backgroundColor: '#4F46E5',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#9CA3AF',
          
          // --- FIXING THE LAYOUT COLLISION ---
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            // This pushes the text up away from the system buttons
            marginBottom: Platform.OS === 'android' ? 12 : 0, 
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            // Increase total height to provide breathing room
            height: Platform.OS === 'android' ? 110 : 100,
            // Ensures icons are centered properly
            paddingTop: 8, 
            // Extra padding at the bottom for Android system nav
            paddingBottom: Platform.OS === 'android' ? 20 : 30,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            elevation: 10, // Shadow for Android
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          // ----------------------------------------

          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
            else if (route.name === 'Scan') iconName = focused ? 'qr-code' : 'qr-code-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
            return (
              <View style={{ marginBottom: Platform.OS === 'android' ? 5 : 0 }}>
                <Ionicons name={iconName} size={24} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});