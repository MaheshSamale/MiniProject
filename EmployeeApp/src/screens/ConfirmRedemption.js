import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is used for Expo
import { getMyCoupons, redeemCoupon } from '../services/employee';

const { width } = Dimensions.get('window');

export default function ConfirmRedemption({ route, navigation }) {
    const { vendor } = route.params;
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const res = await getMyCoupons();
        if (res.status === 'success') {
            setCoupons(res.data);
            if (res.data.length > 0) setSelectedCoupon(res.data[0]);
        }
        setLoading(false);
    };

    const handleConfirmPayment = async () => {
        if (!selectedCoupon) return;
        setSubmitting(true);
        const res = await redeemCoupon(vendor.vendor_id, selectedCoupon.coupon_master_id, quantity);
        setSubmitting(false);
    
        if (res.status === 'success') {
            // Navigate to Success Screen instead of Alert
            navigation.navigate('SuccessScreen', {
                vendorName: vendor.vendor_name,
                quantity: quantity
            });
        } else {
            Alert.alert("Failed", res.message);
        }
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Fetching your wallet...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header section with Vendor Info */}
            <View style={styles.headerCard}>
                <View style={styles.iconCircle}>
                    <Ionicons name="restaurant" size={30} color="#FFF" />
                </View>
                <Text style={styles.vendorLabel}>Paying to</Text>
                <Text style={styles.vendorName}>{vendor.vendor_name}</Text>
                <View style={styles.vendorBadge}>
                    <Text style={styles.vendorIdText}>ID: {vendor.vendor_id}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Select Coupon</Text>
                <FlatList
                    data={coupons}
                    keyExtractor={(item) => item.allocation_id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isSelected = selectedCoupon?.allocation_id === item.allocation_id;
                        return (
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={[styles.couponCard, isSelected && styles.selectedCouponCard]}
                                onPress={() => { setSelectedCoupon(item); setQuantity(1); }}
                            >
                                <View style={styles.couponInfo}>
                                    <Text style={[styles.couponName, isSelected && styles.selectedText]}>{item.coupon_name}</Text>
                                    <Text style={styles.couponValue}>₹{item.coupon_value}</Text>
                                </View>
                                <View style={[styles.remainingBadge, isSelected && styles.selectedBadge]}>
                                    <Text style={[styles.remainingText, isSelected && styles.selectedText]}>{item.remaining} left</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Sticky Bottom Section */}
            <View style={styles.footer}>
                <View style={styles.quantityBox}>
                    <Text style={styles.qtyLabel}>Quantity</Text>
                    <View style={styles.stepper}>
                        <TouchableOpacity 
                            onPress={() => setQuantity(q => Math.max(1, q - 1))} 
                            style={styles.stepperBtn}
                        >
                            <Ionicons name="remove" size={20} color="#4F46E5" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{quantity}</Text>
                        <TouchableOpacity 
                            onPress={() => setQuantity(q => Math.min(selectedCoupon?.remaining || 1, q + 1))} 
                            style={styles.stepperBtn}
                        >
                            <Ionicons name="add" size={20} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.payBtn, submitting && styles.disabledBtn]} 
                    onPress={handleConfirmPayment}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.payBtnText}>Confirm Redemption</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    loadingText: { marginTop: 15, color: '#64748B', fontWeight: '500' },
    
    headerCard: {
        backgroundColor: '#4F46E5',
        padding: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 10,
        shadowColor: '#4F46E5',
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    vendorLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
    vendorName: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginVertical: 5 },
    vendorBadge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 5
    },
    vendorIdText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

    content: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 20 },
    
    couponCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedCouponCard: {
        borderColor: '#4F46E5',
        backgroundColor: '#EEF2FF',
        borderWidth: 2,
    },
    couponInfo: { flex: 1 },
    couponName: { fontSize: 16, fontWeight: '700', color: '#334155' },
    couponValue: { fontSize: 15, color: '#4F46E5', fontWeight: '600', marginTop: 4 },
    remainingBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    selectedBadge: { backgroundColor: '#4F46E5' },
    remainingText: { fontSize: 12, color: '#64748B', fontWeight: 'bold' },
    selectedText: { color: '#4F46E5' },
    selectedText: { color: '#FFF' }, // Overwrite for badge

    footer: {
        backgroundColor: '#FFF',
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    quantityBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    qtyLabel: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 15,
        padding: 5
    },
    stepperBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2
    },
    qtyText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, color: '#1E293B' },
    
    payBtn: {
        backgroundColor: '#4F46E5',
        height: 60,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    payBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    disabledBtn: { opacity: 0.6 }
});