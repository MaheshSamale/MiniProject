import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { assignCoupon } from '../services/company';

function AssignCoupon({ route, navigation }) {
    const { employee_code, name } = route.params;
    
    // You might want to fetch available coupon masters here to show in a dropdown
    // For now, we will use text inputs
    const [couponMasterId, setCouponMasterId] = useState(''); 
    const [quantity, setQuantity] = useState('');
    const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const handleAssign = async () => {
        if (!couponMasterId || !quantity) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const result = await assignCoupon(employee_code, couponMasterId, quantity, monthYear);
        if (result && result.status === 'success') {
            Alert.alert('Success', 'Coupons assigned successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result?.error || 'Failed to assign');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Assign Coupons</Text>
                <View style={{width: 24}} />
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Assigning to: <Text style={styles.bold}>{name}</Text></Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Coupon Type ID</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter Master ID (e.g. 1)" 
                        keyboardType="numeric"
                        value={couponMasterId}
                        onChangeText={setCouponMasterId}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Number of coupons" 
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Month (YYYY-MM)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={monthYear}
                        onChangeText={setMonthYear}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleAssign}>
                    <Text style={styles.buttonText}>Confirm Assignment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    subtitle: { fontSize: 16, marginBottom: 20, color: '#374151' },
    bold: { fontWeight: 'bold', color: '#4F46E5' },
    inputGroup: { marginBottom: 15 },
    label: { marginBottom: 5, color: '#374151', fontWeight: '600' },
    input: { backgroundColor: 'white', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#D1D5DB' },
    button: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default AssignCoupon;