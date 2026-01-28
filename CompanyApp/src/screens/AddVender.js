import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    StatusBar, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { registerVendor } from '../services/company';

function AddVendor({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !phone || !password || !location) {
            Alert.alert('Missing Info', 'Please fill all fields to continue.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerVendor(name, email, phone, password, location);
            
            if (result.status === 'success') {
                Alert.alert('Success', 'Vendor added successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Registration Failed', result.error || 'Could not add vendor.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, setter, placeholder, icon, options = {}) => (
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
                    autoCapitalize={options.autoCapitalize || "none"}
                    secureTextEntry={options.secure || false}
                    keyboardType={options.keyboardType || "default"}
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
                <Text style={styles.headerTitle}>New Vendor</Text>
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
                                <Ionicons name="business" size={24} color="#4F46E5" />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Vendor Details</Text>
                                <Text style={styles.cardSubtitle}>Register a new partner</Text>
                            </View>
                        </View>

                        {renderInput('Vendor Name', name, setName, 'Acme Corp', 'briefcase-outline', { autoCapitalize: 'words' })}

                        {renderInput('Email Address', email, setEmail, 'contact@acme.com', 'mail-outline', { keyboardType: 'email-address' })}

                        {renderInput('Password', password, setPassword, 'Min. 6 characters', 'lock-closed-outline', { secure: true })}
                        
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                {renderInput('Phone', phone, setPhone, '9876543210', 'call-outline', { keyboardType: 'phone-pad' })}
                            </View>
                            <View style={{ flex: 1 }}>
                                {renderInput('Location', location, setLocation, 'Delhi', 'location-outline', { autoCapitalize: 'words' })}
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.submitButton} 
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Processing...' : 'Add Vendor'}
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
});

export default AddVendor;