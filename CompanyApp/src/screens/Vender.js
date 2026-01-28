import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { useFocusEffect } from '@react-navigation/native';
import { getAllVendors } from '../services/company';

function Vendor({ navigation }) {
  const [allVendors, setAllVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      getVendors();
    }, [])
  );

  const getVendors = async () => {
    try {
      const result = await getAllVendors();
      if (result.status === "success") {
        setAllVendors(result.data);
        setFilteredVendors(result.data);
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch vendors');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = allVendors.filter((item) => {
        const itemData = item.vendor_name ? item.vendor_name.toUpperCase() : ''.toUpperCase();
        const locData = item.location ? item.location.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        
        return itemData.includes(textData) || locData.includes(textData);
      });
      setFilteredVendors(newData);
    } else {
      setFilteredVendors(allVendors);
    }
  };

  const getInitials = (name) => {
    if (!name) return "V";
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const renderVendorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      // onPress={() => navigation.navigate('VendorDetails', { id: item.vendor_id })}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{getInitials(item.vendor_name)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.vendorName}>{item.vendor_name}</Text>
        <Text style={styles.vendorEmail}>{item.email}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={12} color="#6B7280" style={{marginRight: 4}} />
          <Text style={styles.vendorLocation}>{item.location}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vendors</Text>
          <Text style={styles.headerSubtitle}>{allVendors.length} Active Partners</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddVendor')}
        >
          <Ionicons name="add" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendor or location..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredVendors}
        keyExtractor={(item) => item.vendor_id ? item.vendor_id.toString() : Math.random().toString()}
        renderItem={renderVendorItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No vendors found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5', // Consistent Brand Color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#E0E7FF',
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 14, // Slightly squarer for businesses/vendors
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  vendorEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vendorLocation: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  }
});

export default Vendor;