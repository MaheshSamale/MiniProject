import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVendorProfile } from '../services/vendor';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export default function Profile({ navigation }) {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        setLoading(true);
        const res = await getVendorProfile(); //
        if (res && res.status === 'success') {
            setProfileData(res.data); //
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: 'destructive', onPress: async () => {
                await AsyncStorage.removeItem('token');
                // Use your context setVendor(null) here if needed
                Alert.alert("Logged Out", "Please restart the app.");
            }}
        ]);
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Ionicons name="person-circle" size={100} color="#4F46E5" />
                    <Text style={styles.name}>{profileData?.vendor_name || "Vendor Partner"}</Text>
                    <Text style={styles.location}>{profileData?.location || "Main Branch"}</Text>
                </View>

                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
                </View>

                <View style={styles.menuCard}>
                    <View style={styles.settingItem}>
                        <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                        <View style={styles.textStack}>
                            <Text style={styles.label}>Vendor Name</Text>
                            <Text style={styles.value}>{profileData?.vendor_name || 'Not Set'}</Text>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.settingItem}>
                        <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                        <View style={styles.textStack}>
                            <Text style={styles.label}>Store Location</Text>
                            <Text style={styles.value}>{profileData?.location || 'Not Set'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 10 },
    location: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    sectionTitleContainer: { marginBottom: 10, marginLeft: 10 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 1 },
    menuCard: { backgroundColor: 'white', borderRadius: 20, padding: 15, elevation: 2 },
    settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    textStack: { marginLeft: 15 },
    label: { fontSize: 12, color: '#9CA3AF' },
    value: { fontSize: 16, color: '#1F2937', fontWeight: '600', marginTop: 2 },
    line: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 5 },
    logoutBtn: { flexDirection: 'row', backgroundColor: '#FFF', marginTop: 30, padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
    logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10 },
});