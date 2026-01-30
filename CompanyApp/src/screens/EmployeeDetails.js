import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { getEmployeeById } from '../services/company'; // Import your API

function EmployeeDetails({ route, navigation }) {
    const { id } = route.params; // Passed from the list screen
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const result = await getEmployeeById(id);
            if (result.status === 'success') {
                setEmployee(result.data);
            } else {
                Alert.alert('Error', 'Could not fetch employee details');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.loading}><ActivityIndicator size="large" color="#4F46E5" /></View>;
    }

    if (!employee) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Employee Profile</Text>
                <View style={{width: 24}} />
            </View>

            {/* Profile Card */}
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{employee.name?.charAt(0)}</Text>
                </View>
                <Text style={styles.name}>{employee.name}</Text>
                <Text style={styles.role}>{employee.department}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{employee.employee_code}</Text>
                </View>

                {/* Info Rows */}
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <Text style={styles.infoText}>{employee.email}</Text>
                </View>
                {/* Add more fields here if available */}
            </View>

            {/* Actions */}
            <View style={styles.actionContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('AssignCoupon', { 
                        employee_code: employee.employee_code,
                        name: employee.name 
                    })}
                >
                    <Ionicons name="ticket-outline" size={24} color="#fff" />
                    <Text style={styles.actionText}>Assign Coupon</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    card: { margin: 20, backgroundColor: 'white', borderRadius: 16, padding: 25, alignItems: 'center', elevation: 4 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarText: { fontSize: 32, color: '#4F46E5', fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    role: { fontSize: 16, color: '#6B7280', marginBottom: 10 },
    badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 20 },
    badgeText: { color: '#374151', fontWeight: '600' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 10, fontSize: 16, color: '#374151' },
    actionContainer: { padding: 20 },
    actionButton: { backgroundColor: '#4F46E5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, elevation: 3 },
    actionText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});

export default EmployeeDetails;