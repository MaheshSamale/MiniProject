import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions } from '../services/employee'; // You'll need to add this to your services

export default function TransactionHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const res = await getTransactions();
        if (res.status === 'success') setHistory(res.data);
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={styles.iconCircle}>
                <Ionicons name="restaurant-outline" size={24} color="#4F46E5" />
            </View>
            <View style={styles.details}>
                <Text style={styles.vendorName}>{item.vendor_name}</Text>
                <Text style={styles.dateText}>{new Date(item.redeemed_at).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>-{item.coupons_used}</Text>
                <Text style={styles.couponLabel}>Coupons</Text>
            </View>
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#FFF' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
    transactionCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1 },
    iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    details: { flex: 1, marginLeft: 15 },
    vendorName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
    dateText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    amountContainer: { alignItems: 'flex-end' },
    amountText: { fontSize: 18, fontWeight: 'bold', color: '#EF4444' },
    couponLabel: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase' },
    empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' }
});