import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import * as Clipboard from 'expo-clipboard';
import { registerEmployee } from '../services/company';

function AddEmployee({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employee_code, setEmployeeCode] = useState('');
    const [department, setDepartment] = useState('');
    
    // UI State
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employeeCredentials, setEmployeeCredentials] = useState(null);

    const copyCredentials = async () => {
        if (!employeeCredentials) return;

        const text =
            `Email: ${employeeCredentials.credentials.email}\n` +
            `Password: ${employeeCredentials.credentials.password}`;

        await Clipboard.setStringAsync(text);
        Alert.alert('Success', 'Credentials copied to clipboard');
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !employee_code || !department) {
            Alert.alert('Missing Info', 'Please fill in all fields to continue.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerEmployee(
                name,
                email,
                password,
                employee_code,
                department
            );

            if (result.status === 'success') {
                setEmployeeCredentials(result.data);
                setModalVisible(true);
            } else {
                Alert.alert('Registration Failed', result.error || 'Something went wrong.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, setter, placeholder, icon, secure = false) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setter}
                    secureTextEntry={secure}
                    autoCapitalize="none"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Employee</Text>
                <View style={{ width: 24 }} /> 
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="person-add" size={24} color="#4F46E5" />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Employee Details</Text>
                                <Text style={styles.cardSubtitle}>Fill in the information below</Text>
                            </View>
                        </View>

                        {renderInput('Full Name', name, setName, 'John Doe', 'person-outline')}
                        {renderInput('Email Address', email, setEmail, 'john@company.com', 'mail-outline')}
                        {renderInput('Password', password, setPassword, 'Min. 6 characters', 'lock-closed-outline', true)}
                        
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                {renderInput('Employee Code', employee_code, setEmployeeCode, 'EMP001', 'id-card-outline')}
                            </View>
                            <View style={{ flex: 1 }}>
                                {renderInput('Department', department, setDepartment, 'Sales', 'business-outline')}
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.submitButton} 
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Creating...' : 'Create Employee'}
                            </Text>
                            {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark" size={40} color="#fff" />
                        </View>
                        
                        <Text style={styles.modalTitle}>Success!</Text>
                        <Text style={styles.modalText}>
                            Employee account has been created successfully.
                        </Text>

                        <View style={styles.credentialsBox}>
                            <View style={styles.credentialRow}>
                                <Text style={styles.credLabel}>Email:</Text>
                                <Text style={styles.credValue}>{employeeCredentials?.credentials.email}</Text>
                            </View>
                            <View style={[styles.credentialRow, { marginTop: 8 }]}>
                                <Text style={styles.credLabel}>Password:</Text>
                                <Text style={styles.credValue}>{employeeCredentials?.credentials.password}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.copyButton} onPress={copyCredentials}>
                            <Ionicons name="copy-outline" size={20} color="#4F46E5" style={{ marginRight: 8 }} />
                            <Text style={styles.copyButtonText}>Copy Credentials</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalDoneButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.modalDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        height: 60,
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    backButton: {
        padding: 5,
    },
    scrollContent: {
        padding: 20,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        height: 50,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        height: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        height: 54,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 10,
    },
    successIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#10B981', // Green for success
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: -50, // Floating effect
        borderWidth: 4,
        borderColor: '#fff',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 20,
    },
    credentialsBox: {
        width: '100%',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    credentialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    credLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    credValue: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: 'bold',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        marginBottom: 12,
    },
    copyButtonText: {
        color: '#4F46E5',
        fontSize: 15,
        fontWeight: '700',
    },
    modalDoneButton: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#10B981',
        alignItems: 'center',
    },
    modalDoneText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddEmployee;