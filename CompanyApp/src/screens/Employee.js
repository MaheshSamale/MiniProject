import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { useFocusEffect } from '@react-navigation/native';
import { getAllEmployees, deleteEmployee } from '../services/company';

function Employee({ navigation }) {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getEmployees();
    }, [])
  );

  const getEmployees = async () => {
    setLoading(true);
    try {
      const result = await getAllEmployees();
      if (result.status === "success") {
        setAllEmployees(result.data);
        // If we are currently searching, re-apply the filter, otherwise show all
        if (searchText) {
          filterData(searchText, result.data);
        } else {
          setFilteredEmployees(result.data);
        }
      } else {
        console.log(result.error); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Separated filter logic so we can reuse it
  const filterData = (text, data = allEmployees) => {
    if (text) {
      const newData = data.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        const emailData = item.email ? item.email.toUpperCase() : ''.toUpperCase();
        return itemData.indexOf(textData) > -1 || emailData.indexOf(textData) > -1;
      });
      setFilteredEmployees(newData);
    } else {
      setFilteredEmployees(data);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterData(text);
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Optimistic update or wait for API? Let's wait for API to be safe.
            const result = await deleteEmployee(id);
            
            if (result && result.status === 'success') {
              // 1. Remove from local state immediately (Fast UI)
              const updatedList = allEmployees.filter(item => item.employee_id !== id);
              setAllEmployees(updatedList);
              
              // 2. Update the visible list (filtered list)
              filterData(searchText, updatedList);
              
              Alert.alert("Success", "Employee removed successfully.");
            } else {
              Alert.alert("Error", result?.error || "Failed to delete employee.");
            }
          }
        }
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return "E";
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('EmployeeDetails', { id: item.employee_id })}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.employeeName}>{item.name}</Text>
          {item.employee_code && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.employee_code}</Text>
            </View>
          )}
        </View>
        <Text style={styles.employeeEmail}>{item.email}</Text>
        <Text style={styles.departmentText}>{item.department || 'No Department'}</Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.employee_id, item.name)}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Team Members</Text>
          <Text style={styles.headerSubtitle}>{allEmployees.length} Active Employees</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEmployee')}
        >
          <Ionicons name="add" size={28} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="#9CA3AF"
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
        data={filteredEmployees}
        keyExtractor={(item) => item.employee_id ? item.employee_id.toString() : Math.random().toString()}
        renderItem={renderEmployeeItem}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={getEmployees}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No employees found</Text>
              <Text style={styles.emptyText}>
                {searchText ? "Try adjusting your search terms" : "Tap the + button to add your first employee"}
              </Text>
            </View>
          )
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5', 
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -15, 
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  employeeEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  departmentText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2', // Light Red Background
    borderRadius: 8,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});

export default Employee;