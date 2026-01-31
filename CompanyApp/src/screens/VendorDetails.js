import React, { useState, useCallback } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    StatusBar, 
    Alert,
    ScrollView,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { getVendorById, getVendorRedemptions, getVendorDailySettlement } from '../services/company'; 
import { useFocusEffect } from '@react-navigation/native';

function VendorDetails({ route, navigation }) {
    const { id } = route.params; 
    
    // Data State
    const [vendor, setVendor] = useState(null);
    const [redemptions, setRedemptions] = useState([]);
    const [settlements, setSettlements] = useState([]);
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('transactions'); 

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    // 👇 Helper to get current YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const fetchData = async () => {
        if (!refreshing) setLoading(true);
        
        try {
            // 1. Fetch Vendor Basic Info
            const vendorRes = await getVendorById(id);
            if (vendorRes.status === 'success') {
                setVendor(vendorRes.data);
            }

            // 2. Fetch Transactions
            try {
                const redemptionsRes = await getVendorRedemptions(id);
                if (redemptionsRes.status === 'success' && Array.isArray(redemptionsRes.data)) {
                    setRedemptions(redemptionsRes.data);
                }
            } catch (err) {
                console.log("Redemption Error:", err);
            }

            // 3. Fetch Daily Settlements (Fixed)
            try {
                const currentMonth = getCurrentMonth(); // Get "2026-01"
                // 👇 PASS BOTH ARGUMENTS HERE
                const settlementsRes = await getVendorDailySettlement(id, currentMonth);
                
                console.log("Settlement Response:", settlementsRes); 

                if (settlementsRes.status === 'success' && Array.isArray(settlementsRes.data)) {
                    setSettlements(settlementsRes.data);
                }
            } catch (err) {
                console.log("Settlement Error:", err);
            }
            
        } catch (error) {
            console.error("General Error:", error);
            Alert.alert('Error', 'Failed to load vendor data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Date Formatters
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!vendor) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Vendor Profile</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Main Profile Card */}
                <View style={styles.card}>
                    <View style={styles.avatar}>
                        <Ionicons name="storefront" size={40} color="#4F46E5" />
                    </View>
                    <Text style={styles.name}>{vendor.vendor_name}</Text>
                    <View style={styles.locationBadge}>
                         <Ionicons name="location" size={14} color="#4B5563" style={{marginRight: 4}} />
                        <Text style={styles.locationText}>{vendor.location}</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Text style={styles.contactText}>{vendor.email}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.contactText}>{vendor.phone || 'No Phone'}</Text>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'transactions' && styles.activeTab]}
                        onPress={() => setActiveTab('transactions')}
                    >
                        <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'settlements' && styles.activeTab]}
                        onPress={() => setActiveTab('settlements')}
                    >
                        <Text style={[styles.tabText, activeTab === 'settlements' && styles.activeTabText]}>Daily Settlement</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                {activeTab === 'transactions' ? (
                    <View>
                        {redemptions.length === 0 ? (
                            <Text style={styles.emptyText}>No transactions found.</Text>
                        ) : (
                            redemptions.map((item, index) => (
                                <View key={index} style={styles.itemCard}>
                                    <View style={styles.itemRow}>
                                        <View>
                                            <Text style={styles.itemTitle}>{item.employee_name}</Text>
                                            <Text style={styles.itemSubtitle}>{item.employee_code} • {item.coupon_name}</Text>
                                        </View>
                                        <View style={{alignItems: 'flex-end'}}>
                                            <Text style={styles.amountText}>+ ₹{item.monetary_value}</Text>
                                            <Text style={styles.dateText}>{formatDate(item.redeemed_at)}</Text>
                                            <Text style={styles.timeText}>{formatTime(item.redeemed_at)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                ) : (
                    <View>
                        {settlements.length === 0 ? (
                            <Text style={styles.emptyText}>No settlement data available for {getCurrentMonth()}.</Text>
                        ) : (
                            settlements.map((item, index) => (
                                <View key={index} style={styles.itemCard}>
                                    <View style={styles.itemRow}>
                                        <View style={styles.calendarBox}>
                                            <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
                                        </View>
                                        <View style={{flex: 1, marginLeft: 12}}>
                                            <Text style={styles.itemTitle}>{formatDate(item.date)}</Text>
                                            <Text style={styles.itemSubtitle}>
                                                {item.transaction_count} Txns • {item.total_coupons} Coupons
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.settlementAmount}>₹{item.total_value}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}
                <View style={{height: 30}} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    card: { backgroundColor: 'white', borderRadius: 16, padding: 25, alignItems: 'center', elevation: 3, marginBottom: 20 },
    avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    name: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
    locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 10 },
    locationText: { color: '#374151', fontWeight: '600', fontSize: 13 },
    contactRow: { flexDirection: 'row', alignItems: 'center' },
    contactText: { color: '#6B7280', fontSize: 13 },
    dot: { marginHorizontal: 8, color: '#9CA3AF' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 15 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: 'white', elevation: 2 },
    tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#4F46E5', fontWeight: '700' },
    itemCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1, borderLeftWidth: 4, borderLeftColor: '#4F46E5' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
    itemSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    amountText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
    dateText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    timeText: { fontSize: 11, color: '#9CA3AF' },
    calendarBox: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    settlementAmount: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 },
});

export default VendorDetails;