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
    Platform,
    ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { registerCompany } from '../../services/auth';

function CompanySignUp({ navigation }) {
    // Form State
    const [company_name, setCompanyName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    
    // UI State
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        // Basic Validation
        if(!company_name || !name || !email || !phone || !address || !password) {
            Alert.alert('Missing Fields', 'Please fill in all the details to register.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerCompany(company_name, name, email, phone, password, address);
            
            if (result.status === 'success') {
                Alert.alert(
                    'Success', 
                    'Account created successfully! Please sign in.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Registration Failed', result.error || 'Could not create account.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to render inputs cleanly
    const renderInput = (label, value, setter, placeholder, icon, options = {}) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setter}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize={options.autoCapitalize || "none"}
                    keyboardType={options.keyboardType || "default"}
                    secureTextEntry={options.secure || false}
                />
                {options.isPassword && (
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons 
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color="#9CA3AF" 
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

            {/* Header Background */}
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Create Account</Text>
                        <Text style={styles.headerSubtitle}>Register your company</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.card}>
                        
                        {renderInput('Company Name', company_name, setCompanyName, 'e.g. Tech Solutions Ltd', 'business-outline', { autoCapitalize: 'words' })}
                        
                        {renderInput('Admin Name', name, setName, 'e.g. John Doe', 'person-outline', { autoCapitalize: 'words' })}
                        
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                {renderInput('Phone', phone, setPhone, 'e.g. 9876543210', 'call-outline', { keyboardType: 'phone-pad' })}
                            </View>
                        </View>

                        {renderInput('Email Address', email, setEmail, 'e.g. admin@company.com', 'mail-outline', { keyboardType: 'email-address' })}
                        
                        {renderInput('Office Address', address, setAddress, 'e.g. 123 Business St, NY', 'location-outline', { autoCapitalize: 'words' })}
                        
                        {renderInput('Password', password, setPassword, 'Min. 6 characters', 'lock-closed-outline', { secure: !isPasswordVisible, isPassword: true })}

                        {/* Sign Up Button */}
                        <TouchableOpacity 
                            style={styles.signUpButton} 
                            onPress={signup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.signUpButtonText}>Register Company</Text>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

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
    headerBackground: {
        backgroundColor: '#4F46E5',
        height: 120,
        paddingTop: 50,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E0E7FF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        marginTop: 5, // Floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
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
    signUpButton: {
        backgroundColor: '#4F46E5',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 15,
    },
    loginLink: {
        color: '#4F46E5',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default CompanySignUp;