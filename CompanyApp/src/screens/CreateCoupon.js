import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { createCouponMaster } from '../services/company';

function CreateCoupon({ navigation }) {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = async () => {
        if (!name || !limit || !value) return Alert.alert('Error', 'Fill all fields');
        
        const result = await createCouponMaster(name, limit, value);
        if (result && result.status === 'success') {
            Alert.alert('Success', 'Coupon Type Created!');
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to create');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Coupon Type</Text>
                <View style={{width: 24}} />
            </View>

            <View style={styles.card}>
                <View style={styles.inputRow}>
                    <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Coupon Name (e.g. Lunch)" 
                        value={name} onChangeText={setName} 
                    />
                </View>
                <View style={styles.inputRow}>
                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Monthly Limit" 
                        keyboardType="numeric" 
                        value={limit} onChangeText={setLimit} 
                    />
                </View>
                <View style={styles.inputRow}>
                    <Ionicons name="cash-outline" size={20} color="#6B7280" />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Value (Amount)" 
                        keyboardType="numeric" 
                        value={value} onChangeText={setValue} 
                    />
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Create Master</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    card: { backgroundColor: 'white', margin: 20, borderRadius: 15, padding: 20, elevation: 3 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 20, paddingBottom: 5 },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },
    btn: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default CreateCoupon;