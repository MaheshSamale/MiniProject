import React, { useState, useCallback } from 'react';
import { 
    View, Text, Image, StyleSheet, ActivityIndicator, 
    TouchableOpacity, Alert, ScrollView, StatusBar 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getVendorById, regenerateVendorQR } from '../services/company';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export default function VendorDetails({ route }) {
    const { id } = route.params;
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // useFocusEffect solves the "not showing" issue by refreshing data on entry
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                const result = await getVendorById(id);
                if (result?.status === 'success') {
                    setVendor(result.data);
                }
                setLoading(false);
            };
            loadData();
        }, [id])
    );

    const handleRegenerate = async () => {
        Alert.alert("Regenerate QR", "Create a new static QR for this vendor?", [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: async () => {
                setIsRegenerating(true);
                const result = await regenerateVendorQR(id);
                if (result?.status === 'success') {
                    // Update state immediately so UI changes without a reload
                    setVendor(prev => ({ ...prev, qr_code_url: result.data.qr_code }));
                    Alert.alert("Success", "New QR Code generated and saved.");
                }
                setIsRegenerating(false);
            }}
        ]);
    };

    if (loading && !vendor) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{vendor?.vendor_name}</Text>
                <Text style={styles.headerSubtitle}><Ionicons name="location" size={14} /> {vendor?.location}</Text>
            </View>

            <View style={styles.qrCard}>
                <Text style={styles.qrLabel}>VENDOR SCANNER CODE</Text>
                <View style={styles.qrWrapper}>
                    {vendor?.qr_code_url ? (
                        <Image source={{ uri: vendor.qr_code_url }} style={styles.qrImage} />
                    ) : (
                        <View style={styles.noQr}>
                            <Ionicons name="qr-code-outline" size={60} color="#D1D5DB" />
                            <Text style={{color: '#9CA3AF'}}>No QR Found</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.regenBtn} 
                    onPress={handleRegenerate}
                    disabled={isRegenerating}
                >
                    {isRegenerating ? (
                        <ActivityIndicator size="small" color="#4F46E5" />
                    ) : (
                        <>
                            <Ionicons name="refresh" size={16} color="#4F46E5" />
                            <Text style={styles.regenText}>Regenerate Code</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.sectionTitle}>Contact Details</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>Email Address</Text>
                        <Text style={styles.infoValue}>{vendor?.email || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                    <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>Phone Number</Text>
                        <Text style={styles.infoValue}>{vendor?.phone || 'N/A'}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

// THIS IS THE BLOCK THAT WAS LIKELY MISSING OR HAD A TYPO
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: '#4F46E5', paddingBottom: 60, paddingTop: 30, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    headerSubtitle: { color: '#E0E7FF', marginTop: 5, fontSize: 14 },
    qrCard: { 
        backgroundColor: 'white', marginHorizontal: 20, marginTop: -40, 
        borderRadius: 20, padding: 25, alignItems: 'center',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 
    },
    qrLabel: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 15 },
    qrWrapper: { padding: 10, backgroundColor: '#F3F4F6', borderRadius: 15 },
    qrImage: { width: 200, height: 200 },
    noQr: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
    regenBtn: { flexDirection: 'row', marginTop: 20, backgroundColor: '#EEF2FF', padding: 12, borderRadius: 10 },
    regenText: { color: '#4F46E5', fontWeight: 'bold', marginLeft: 8 },
    infoBox: { padding: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    infoTextGroup: { marginLeft: 15 },
    infoLabel: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase' },
    infoValue: { fontSize: 16, color: '#1F2937', fontWeight: '600' }
});