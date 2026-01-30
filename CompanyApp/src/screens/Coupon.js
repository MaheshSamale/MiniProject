import React, { useState, useCallback } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList, 
    StatusBar, 
    Alert 
} from 'react-native';
// Correct import for vector icons
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { getAllCouponsMaster, deleteCouponMaster } from '../services/company'; 
import { useFocusEffect } from '@react-navigation/native';

export default function Coupan({ navigation }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchCoupons();
        }, [])
    );

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const result = await getAllCouponsMaster();
            if (result.status === 'success') {
                setCoupons(result.data);
            } else {
                // console.log(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 👇 New Delete Function
    const handleDelete = (id, name) => {
        Alert.alert(
            "Delete Coupon",
            `Are you sure you want to delete the "${name}" coupon type?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const result = await deleteCouponMaster(id);
                            if (result.status === 'success') {
                                Alert.alert("Success", "Coupon type deleted successfully");
                                fetchCoupons(); // Refresh the list
                            } else {
                                Alert.alert("Error", result.error || "Failed to delete coupon");
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Error", "An unexpected error occurred");
                        }
                    }
                }
            ]
        );
    };

    const renderCouponItem = ({ item }) => (
        <View style={styles.card}>
            {/* Icon Section */}
            <View style={styles.iconContainer}>
                <Ionicons name="ticket" size={24} color="#4F46E5" />
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
                <Text style={styles.couponName}>{item.coupon_name}</Text>
                <View style={styles.limitBadge}>
                    <Text style={styles.limitText}>Limit: {item.monthly_limit}/mo</Text>
                </View>
            </View>

            {/* Value Section */}
            <View style={styles.valueContainer}>
                <Text style={styles.valueLabel}>Value</Text>
                <Text style={styles.valueAmount}>₹{item.coupon_value}</Text>
            </View>

            {/* 👇 Delete Button Added Here */}
            <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.coupon_master_id, item.coupon_name)}
            >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Coupon Types</Text>
                    <Text style={styles.headerSubtitle}>{coupons.length} Active Types</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CreateCoupon')} 
                >
                    <Ionicons name="add" size={26} color="#4F46E5" />
                </TouchableOpacity>
            </View>

            {/* List Content */}
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={coupons}
                keyExtractor={(item) => item.coupon_master_id ? item.coupon_master_id.toString() : Math.random().toString()}
                renderItem={renderCouponItem}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={fetchCoupons}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="pricetags-outline" size={60} color="#ddd" />
                            <Text style={styles.emptyText}>No coupons found.</Text>
                            <Text style={styles.emptySubText}>Create a master coupon to get started.</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        backgroundColor: '#4F46E5', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: '#E0E7FF',
        fontSize: 14,
        marginTop: 4,
    },
    addButton: {
        backgroundColor: 'white',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100, 
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    couponName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    limitBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    limitText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    valueContainer: {
        alignItems: 'flex-end',
        marginRight: 15, // Space before delete button
    },
    valueLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    valueAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981', 
    },
    // 👇 New Styles for Delete Button
    deleteBtn: {
        padding: 8,
        backgroundColor: '#FEF2F2', // Light Red
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    emptySubText: {
        marginTop: 5,
        fontSize: 14,
        color: '#9CA3AF',
    },
});