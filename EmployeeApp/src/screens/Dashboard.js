import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(`${config.BASE_URL}/employee/my-coupons`, { headers: { token } });
            if (res.data.status === 'success') setCoupons(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { loadData(); }, []));

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.name}>{item.coupon_name}</Text>
                <Text style={styles.value}>Value: ₹{item.coupon_value}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.count}>{item.remaining}</Text>
                <Text style={styles.subText}>Remaining</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Wallet</Text>
            <FlatList
                data={coupons}
                keyExtractor={item => item.allocation_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { fontSize: 24, fontWeight: 'bold', padding: 20, color: '#1F2937' },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, elevation: 2 },
    name: { fontSize: 18, fontWeight: 'bold' },
    value: { color: '#4F46E5', marginTop: 5 },
    badge: { alignItems: 'center', backgroundColor: '#F5F3FF', padding: 10, borderRadius: 12 },
    count: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5' },
    subText: { fontSize: 10, color: '#9CA3AF' }
});