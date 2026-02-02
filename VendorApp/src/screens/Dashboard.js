import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    RefreshControl, 
    SafeAreaView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyTransactions } from '../services/vendor';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Calculate total for the day
    const totalEarnings = transactions.reduce((sum, item) => sum + parseFloat(item.total_value || 0), 0);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            const data = await getMyTransactions();
            setTransactions(data || []);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                    <Ionicons name="person" size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                    {/* Updated keys to match typical backend field names */}
                    <Text style={styles.empName}>{item.employee_name}</Text>
                    <Text style={styles.details}>{item.coupon_name} • Qty: {item.coupons_used}</Text>
                </View>
                <Text style={styles.amount}>+₹{parseFloat(item.total_value || 0).toFixed(2)}</Text>
            </View>
            <Text style={styles.time}>
                {new Date(item.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Summary Section */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Collections Today</Text>
                <Text style={styles.summaryAmount}>₹{totalEarnings.toFixed(2)}</Text>
                <Text style={styles.summaryCount}>{transactions.length} Transactions</Text>
            </View>

            <Text style={styles.sectionTitle}>Recent Payments</Text>
            
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.transaction_id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 120 }} 
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={() => { setRefreshing(true); loadData(); }} 
                        tintColor="#4F46E5"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.empty}>Waiting for first payment...</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    summaryCard: { 
        backgroundColor: '#4F46E5', 
        margin: 20, 
        padding: 30, 
        borderRadius: 25, 
        elevation: 8,
        shadowColor: '#4F46E5',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 }
    },
    summaryLabel: { color: '#E0E7FF', fontSize: 14, fontWeight: '600' },
    summaryAmount: { color: 'white', fontSize: 36, fontWeight: '800', marginVertical: 8 },
    summaryCount: { color: '#E0E7FF', fontSize: 12, opacity: 0.9 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginLeft: 25, marginBottom: 15, color: '#1F2937' },
    card: { 
        backgroundColor: 'white', 
        marginHorizontal: 20, 
        marginBottom: 12, 
        padding: 16, 
        borderRadius: 18, 
        elevation: 2 
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { 
        width: 40, 
        height: 40, 
        borderRadius: 12, 
        backgroundColor: '#F5F3FF', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    empName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    details: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    amount: { fontSize: 16, fontWeight: '800', color: '#10B981' },
    time: { fontSize: 10, color: '#9CA3AF', marginTop: 10, alignSelf: 'flex-end' },
    empty: { textAlign: 'center', marginTop: 50, color: '#9CA3AF', fontSize: 16 }
});