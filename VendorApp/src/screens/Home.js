import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons'; 
import Dashboard from './Dashboard';
import QrCode from './QrCode';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#4F46E5', 
          tabBarInactiveTintColor: '#9CA3AF', 
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 5,
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 5,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            height: 70,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 5, 
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'My QR') {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } 
            
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="My QR" component={QrCode} />
        <Tab.Screen name="Profile" component={Profile} />
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