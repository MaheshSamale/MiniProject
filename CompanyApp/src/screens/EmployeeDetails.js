import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    StatusBar, 
    Alert,
    ScrollView 
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { getEmployeeById, getEmployeeCoupons } from '../services/company';

function EmployeeDetails({ route, navigation }) {
    const { id } = route.params;
    
    const [employee, setEmployee] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Re-fetch data whenever screen comes into focus (e.g., after assigning new coupons)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both Employee Details & Coupon Data in parallel
            const [empResult, couponResult] = await Promise.all([
                getEmployeeById(id),
                getEmployeeCoupons(id) // Pass ID to fetch coupons
            ]);

            if (empResult.status === 'success') {
                setEmployee(empResult.data);
            } else {
                Alert.alert('Error', 'Could not fetch employee details');
            }

            if (couponResult.status === 'success') {
                setCoupons(couponResult.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderCouponItem = ({ item }) => (
        <View style={styles.couponCard}>
            <View style={styles.couponHeader}>
                <View style={styles.iconBox}>
                    <Ionicons name="ticket" size={20} color="#4F46E5" />
                </View>
                <View>
                    <Text style={styles.couponName}>{item.coupon_name}</Text>
                    <Text style={styles.couponDate}>{item.month_year}</Text>
                </View>
            </View>
            
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Allocated</Text>
                    <Text style={styles.statValue}>{item.allocated}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#059669' }]}>{item.remaining}</Text>
                    <Text style={styles.statLabel}>Remaining</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#EF4444' }]}>{item.used}</Text>
                    <Text style={styles.statLabel}>Used</Text>
                </View>
            </View>
        </View>
    );

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

            <ScrollView contentContainerStyle={styles.scrollContent}>
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

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#6B7280" />
                        <Text style={styles.infoText}>{employee.email}</Text>
                    </View>
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
                        <Ionicons name="add-circle-outline" size={22} color="#fff" />
                        <Text style={styles.actionText}>Assign New Coupon</Text>
                    </TouchableOpacity>
                </View>

                {/* Coupon Wallet Section */}
                <Text style={styles.sectionTitle}>Coupon Wallet</Text>
                
                {coupons.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="wallet-outline" size={40} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No coupons assigned yet.</Text>
                    </View>
                ) : (
                    coupons.map((item, index) => (
                        <View key={index}>
                            {renderCouponItem({ item })}
                        </View>
                    ))
                )}
                
                <View style={{ height: 30 }} /> 
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    scrollContent: { paddingBottom: 20 },
    
    // Profile Card
    card: { margin: 20, marginBottom: 10, backgroundColor: 'white', borderRadius: 16, padding: 25, alignItems: 'center', elevation: 3 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarText: { fontSize: 32, color: '#4F46E5', fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    role: { fontSize: 16, color: '#6B7280', marginBottom: 10 },
    badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 20 },
    badgeText: { color: '#374151', fontWeight: '600' },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { marginLeft: 10, fontSize: 16, color: '#374151' },

    // Action Button
    actionContainer: { paddingHorizontal: 20, marginBottom: 20 },
    actionButton: { backgroundColor: '#4F46E5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, elevation: 3 },
    actionText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

    // Coupon Section
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginLeft: 20, marginBottom: 10 },
    couponCard: { 
        backgroundColor: 'white', 
        marginHorizontal: 20, 
        marginBottom: 12, 
        borderRadius: 12, 
        padding: 15,
        elevation: 2 
    },
    couponHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    couponName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    couponDate: { fontSize: 12, color: '#6B7280' },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8 },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
    statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    divider: { width: 1, height: 25, backgroundColor: '#E5E7EB' },

    emptyState: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    emptyText: { color: '#9CA3AF', marginTop: 10 }
});

export default EmployeeDetails;