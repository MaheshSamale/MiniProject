import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen({ route, navigation }) {
    const { vendorName, quantity } = route.params;

    // Prevent user from going back to the payment screen with hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={120} color="#22C55E" />
                </View>
                
                <Text style={styles.successTitle}>Redemption Successful!</Text>
                <Text style={styles.successSub}>Your coupons have been redeemed at</Text>
                <Text style={styles.vendorName}>{vendorName}</Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Total Coupons Redeemed</Text>
                    <Text style={styles.infoValue}>{quantity}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.homeBtn}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.homeBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 25 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    iconContainer: { marginBottom: 30 },
    successTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
    successSub: { fontSize: 16, color: '#64748B', marginTop: 10, textAlign: 'center' },
    vendorName: { fontSize: 20, fontWeight: '700', color: '#4F46E5', marginTop: 5 },
    infoCard: { 
        backgroundColor: '#F8FAFC', 
        padding: 20, 
        borderRadius: 20, 
        width: '100%', 
        marginTop: 40, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    infoLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
    infoValue: { fontSize: 32, fontWeight: '800', color: '#1E293B', marginTop: 5 },
    homeBtn: { 
        backgroundColor: '#1E293B', 
        height: 60, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 20
    },
    homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});