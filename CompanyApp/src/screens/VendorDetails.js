import React, { useState} from 'react';
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
import { getVendorById } from '../services/company'; 
import { useFocusEffect } from '@react-navigation/native';

function VendorDetails({ route, navigation }) {
    const { id } = route.params; 
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

  useFocusEffect(
      React.useCallback(() => {
        fetchDetails();
      }, [])
    );

    const fetchDetails = async () => {
        try {
            const result = await getVendorById(id);
            if (result.status === 'success') {
                setVendor(result.data);
            } else {
                Alert.alert('Error', 'Could not fetch vendor details');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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

            <ScrollView contentContainerStyle={styles.content}>
                
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
                </View>

                {/* Info Section */}
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" />
                        </View>
                        <View>
                            <Text style={styles.label}>Email Address</Text>
                            <Text style={styles.value}>{vendor.email}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Ionicons name="call-outline" size={20} color="#6B7280" />
                        </View>
                        <View>
                            <Text style={styles.label}>Phone Number</Text>
                            <Text style={styles.value}>{vendor.phone || "Not provided"}</Text>
                        </View>
                    </View>
                </View>

                {/* Actions (Optional placeholder for future features) */}
                <Text style={styles.sectionTitle}>Actions</Text>
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="document-text-outline" size={22} color="#fff" />
                        <Text style={styles.actionText}>View Transactions</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    header: { 
        height: 60, 
        backgroundColor: '#4F46E5', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15 
    },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    
    content: { padding: 20 },
    
    card: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 30, 
        alignItems: 'center', 
        elevation: 2,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: { 
        width: 80, 
        height: 80, 
        borderRadius: 20, 
        backgroundColor: '#EEF2FF', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    name: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    locationBadge: { 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#F3F4F6', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    locationText: { color: '#374151', fontWeight: '600', fontSize: 14 },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 10, marginLeft: 4 },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        elevation: 1,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    label: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    value: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },

    actionContainer: { gap: 10 },
    actionButton: { 
        backgroundColor: '#4F46E5', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 12, 
        elevation: 2 
    },
    actionText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});

export default VendorDetails;