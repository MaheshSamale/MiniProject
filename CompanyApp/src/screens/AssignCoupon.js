import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StatusBar,
    Modal,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { assignCoupon, getAllCouponsMaster } from '../services/company';

function AssignCoupon({ route, navigation }) {
    const { employee_code, name } = route.params;
    
    // Form State
    const [couponMasterId, setCouponMasterId] = useState(''); 
    const [selectedCouponName, setSelectedCouponName] = useState(''); 
    const [quantity, setQuantity] = useState('');
    const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7)); 
    
    // Dropdown Data & UI State
    const [couponTypes, setCouponTypes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    useEffect(() => {
        fetchCouponTypes();
    }, []);

    const fetchCouponTypes = async () => {
        setLoadingCoupons(true);
        try {
            const result = await getAllCouponsMaster();
            if (result.status === 'success') {
                console.log("API Data:", result.data); // 👇 Check your console for the real field names!
                setCouponTypes(result.data);
            } else {
                Alert.alert('Error', 'Failed to load coupon types');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCoupons(false);
        }
    };

    const handleSelectCoupon = (item) => {
        // 👇 ROBUST CHECK: Tries to find the ID using common names
        const id = item.coupon_master_id || item.id || item._id;

        if (!id) {
            console.error("Selected item has no ID:", item);
            Alert.alert("Error", "This coupon has no valid ID. Check console for details.");
            return;
        }

        setCouponMasterId(id);
        setSelectedCouponName(`${item.coupon_name} (Value: ₹${item.coupon_value})`);
        setModalVisible(false);
    };

    const handleAssign = async () => {
        // Debugging logs to see what is missing
        console.log("Submitting:", { employee_code, couponMasterId, quantity, monthYear });

        if (!couponMasterId) {
            Alert.alert('Missing Info', 'Please select a Coupon Type');
            return;
        }
        if (!quantity) {
             Alert.alert('Missing Info', 'Please enter a Quantity');
             return;
        }

        const result = await assignCoupon(employee_code, couponMasterId, quantity, monthYear);
        if (result && result.status === 'success') {
            Alert.alert('Success', 'Coupons assigned successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result?.error || 'Failed to assign');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Assign Coupons</Text>
                <View style={{width: 24}} />
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Assigning to: <Text style={styles.bold}>{name}</Text></Text>
                
                {/* Coupon Type Selector */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Coupon Type</Text>
                    <TouchableOpacity 
                        style={[styles.input, styles.dropdownInput]} 
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={selectedCouponName ? styles.inputText : styles.placeholderText}>
                            {selectedCouponName || "Select a Coupon Type"}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Quantity Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Number of coupons" 
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Month (YYYY-MM)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={monthYear}
                        onChangeText={setMonthYear}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleAssign}>
                    <Text style={styles.buttonText}>Confirm Assignment</Text>
                </TouchableOpacity>
            </View>

            {/* Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Coupon</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {loadingCoupons ? (
                            <ActivityIndicator size="large" color="#4F46E5" style={{ margin: 20 }} />
                        ) : (
                            <FlatList
                                data={couponTypes}
                                // 👇 UPDATED: Safe Key Extractor to prevent crashes
                                keyExtractor={(item, index) => {
                                    const id = item.coupon_master_id || item.id || index;
                                    return id.toString();
                                }}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.optionItem} 
                                        onPress={() => handleSelectCoupon(item)}
                                    >
                                        <View>
                                            <Text style={styles.optionTitle}>{item.coupon_name}</Text>
                                            <Text style={styles.optionSubtitle}>Value: ₹{item.coupon_value} | Limit: {item.monthly_limit}</Text>
                                        </View>
                                        {/* Compare using generic ID check */}
                                        {(couponMasterId && (item.coupon_master_id === couponMasterId || item.id === couponMasterId)) && (
                                            <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>No coupons found.</Text>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { height: 60, backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    subtitle: { fontSize: 16, marginBottom: 20, color: '#374151' },
    bold: { fontWeight: 'bold', color: '#4F46E5' },
    inputGroup: { marginBottom: 15 },
    label: { marginBottom: 5, color: '#374151', fontWeight: '600' },
    input: { backgroundColor: 'white', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16 },
    dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    inputText: { color: '#1F2937' },
    placeholderText: { color: '#9CA3AF' },
    button: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    optionItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    optionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    optionSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 }
});

export default AssignCoupon;