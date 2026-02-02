import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getVendorProfile } from '../services/vendor';

const { width } = Dimensions.get('window');

export default function QrCode() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getVendorProfile().then(res => {
                // Verify the response matches your JSON structure
                if (res && res.status === 'success') {
                    setProfile(res.data);
                }
                setLoading(false);
            });
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.vendorName}>{profile?.vendor_name}</Text>
                <Text style={styles.location}>{profile?.location}</Text>
                
                <View style={styles.qrContainer}>
                    {/* FIXED: Changed qr_code_url to qrCodeImage to match your API */}
                    {profile?.qrCodeImage ? (
                        <Image 
                            source={{ uri: profile.qrCodeImage }} 
                            style={styles.qrImage} 
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>QR Code Missing. Contact Admin.</Text>
                        </View>
                    )}
                </View>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>SCAN TO PAY</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', padding: 25 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { 
        backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 30, 
        alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20 
    },
    vendorName: { fontSize: 26, fontWeight: '800', color: '#111827', textTransform: 'capitalize' },
    location: { fontSize: 14, color: '#6B7280', marginBottom: 30 },
    qrContainer: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 20 },
    qrImage: { width: width * 0.65, height: width * 0.65 },
    badge: { marginTop: 30, backgroundColor: '#EEF2FF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 50 },
    badgeText: { color: '#4F46E5', fontWeight: 'bold', letterSpacing: 2 },
    errorBox: { width: 250, height: 250, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: '#EF4444', textAlign: 'center' }
});