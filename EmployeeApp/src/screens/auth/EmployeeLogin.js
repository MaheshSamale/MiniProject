import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  Alert, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeContext } from '../../context/EmployeeContext'; 
import { loginEmployee, resetPasswordByMobile } from '../../services/auth';

function EmployeeLogin({ navigation }) {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Start true to check session first
  
  // Forgot Password & Success State
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { setEmployee } = useContext(EmployeeContext);

  // --- PERSISTENT LOGIN CHECK ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setEmployee({
            name: user.name,
            email: user.email,
            token: token,
          });
          // App.js usually handles navigation based on the Context state
        }
      } catch (e) {
        console.error("Session check error", e);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const signin = async () => {
    const cleanEmail = email.trim(); // Prevent trailing space issues
    if (!cleanEmail || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginEmployee(cleanEmail, password);
      if (result.status === 'success') {
        const userData = result.data;
        
        // Save Token and User Info for future sessions
        await AsyncStorage.setItem('token', userData.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          name: userData.name,
          email: userData.email,
        }));
        
        setEmployee({
          name: userData.name,
          email: userData.email,
          token: userData.token,
        });
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (ex) {
      Alert.alert('Error', 'Connection failed. Please check your server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!phone || !newPwd || !confirmPwd) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPasswordByMobile(phone, newPwd);
      if (res.status === 'success') {
        setIsSuccess(true);
        setTimeout(() => {
          setModalVisible(false);
          setIsSuccess(false);
          setPhone(''); setNewPwd(''); setConfirmPwd('');
        }, 2000);
      } else {
        Alert.alert('Error', res.error || 'Mobile number not registered');
      }
    } catch (ex) {
      Alert.alert('Error', 'Reset failed. Try again later.');
    } finally {
      setResetLoading(false);
    }
  };

  // While checking for the token, show a splash loader
  if (loading && !email) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      <View style={styles.headerBackground}>
        <View style={styles.logoContainer}>
           <Ionicons name="fast-food" size={40} color="#4F46E5" />
        </View>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Sign in to manage your coupons</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPass} onPress={() => setModalVisible(true)}>
               <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={signin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isSuccess ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                <Text style={styles.successTitle}>Reset Successful!</Text>
                <Text style={styles.successSub}>You can now login with your new password.</Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Recover Password</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <TextInput 
                  style={styles.modalInput} 
                  placeholder="Registered Mobile" 
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                />
                <TextInput 
                  style={styles.modalInput} 
                  placeholder="New Password" 
                  secureTextEntry
                  onChangeText={setNewPwd}
                />
                <TextInput 
                  style={styles.modalInput} 
                  placeholder="Confirm Password" 
                  secureTextEntry
                  onChangeText={setConfirmPwd}
                />

                <TouchableOpacity 
                  style={styles.resetBtn} 
                  onPress={handleResetPassword}
                  disabled={resetLoading}
                >
                  {resetLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.resetBtnText}>Update Password</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerBackground: { backgroundColor: '#4F46E5', height: 220, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logoContainer: { width: 70, height: 70, backgroundColor: 'white', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: '#E0E7FF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 25, marginTop: -40, elevation: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, height: 50, paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotPassText: { color: '#4F46E5', fontWeight: '600' },
  signInButton: { backgroundColor: '#4F46E5', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  signInButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 25, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 15, marginBottom: 12 },
  resetBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center' },
  resetBtnText: { color: 'white', fontWeight: 'bold' },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#10B981', marginTop: 15 },
  successSub: { color: '#6B7280', marginTop: 5 }
});

export default EmployeeLogin;