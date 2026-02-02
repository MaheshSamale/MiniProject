import React, { useContext, useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    ActivityIndicator, Modal, TextInput, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeContext } from '../context/EmployeeContext';
import { getProfile } from '../services/employee';
import { updatePassword } from '../services/auth';

export default function Profile({ navigation }) {
    const { setEmployee } = useContext(EmployeeContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Password Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [pwdData, setPwdData] = useState({ old: '', new: '', confirm: '' });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const res = await getProfile();
        if (res.status === 'success') {
            setProfile(res.data);
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async () => {
        if (!pwdData.old || !pwdData.new || !pwdData.confirm) {
            return Alert.alert("Error", "All fields are required");
        }
        if (pwdData.new !== pwdData.confirm) {
            return Alert.alert("Error", "New passwords do not match");
        }

        setUpdating(true);
        const res = await updatePassword(pwdData.old, pwdData.new);
        setUpdating(false);

        if (res.status === 'success') {
            Alert.alert("Success", "Password updated successfully");
            setModalVisible(false);
            setPwdData({ old: '', new: '', confirm: '' });
        } else {
            Alert.alert("Error", res.error || "Failed to update password");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* 1. Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{profile?.name}</Text>
                    <Text style={styles.designationText}>
                        {profile?.designation} • {profile?.department}
                    </Text>
                </View>

                {/* 2. Work Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Work Details</Text>
                    <View style={styles.card}>
                        <InfoRow icon="business-outline" label="Organization" value={profile?.company_name} />
                        <View style={styles.divider} />
                        <InfoRow icon="id-card-outline" label="Employee ID" value={profile?.employee_code} />
                        <View style={styles.divider} />
                        <InfoRow icon="mail-outline" label="Email" value={profile?.email} />
                    </View>
                </View>

                {/* 3. Activity Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Activity</Text>
                    <TouchableOpacity 
                        style={styles.actionCard} 
                        onPress={() => navigation.navigate('TransactionHistory')}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                <Ionicons name="receipt-outline" size={20} color="#10B981" />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>Transaction History</Text>
                                <Text style={styles.actionSub}>View your coupon usage</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* 4. Account Settings (Password Update) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <TouchableOpacity 
                        style={styles.actionCard} 
                        onPress={() => setModalVisible(true)}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="lock-closed-outline" size={20} color="#D97706" />
                            </View>
                            <Text style={styles.actionTitle}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* 5. Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => setEmployee(null)}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutBtnText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.2</Text>
            </ScrollView>

            {/* Change Password Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Password</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <TextInput 
                            style={styles.input} 
                            placeholder="Current Password" 
                            secureTextEntry 
                            onChangeText={(t) => setPwdData({...pwdData, old: t})}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="New Password" 
                            secureTextEntry 
                            onChangeText={(t) => setPwdData({...pwdData, new: t})}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Confirm New Password" 
                            secureTextEntry 
                            onChangeText={(t) => setPwdData({...pwdData, confirm: t})}
                        />

                        <TouchableOpacity 
                            style={styles.updateBtn} 
                            onPress={handlePasswordUpdate}
                            disabled={updating}
                        >
                            {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.updateBtnText}>Update Password</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={styles.iconBox}><Ionicons name={icon} size={20} color="#4F46E5" /></View>
        <View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', paddingVertical: 35, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
    designationText: { fontSize: 14, color: '#64748B', marginTop: 4 },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, elevation: 1 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    label: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
    value: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 },
    actionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    actionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
    actionSub: { fontSize: 12, color: '#64748B' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 25, padding: 16, borderRadius: 15, borderWidth: 1, borderColor: '#FEE2E2' },
    logoutBtnText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10 },
    versionText: { textAlign: 'center', color: '#CBD5E1', fontSize: 11, marginBottom: 20 },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 15, marginBottom: 12, fontSize: 15 },
    updateBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    updateBtnText: { color: '#FFF', fontWeight: 'bold' }
});