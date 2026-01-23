import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { getAllEmployees } from '../services/company'
import { useFocusEffect } from '@react-navigation/native';

function Employee({ navigation }) {
  const [allEmployees, setAllEmployees] = useState([])
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getEmployees();
    }, [])
  );

  const getEmployees = async () => {
    const result = await getAllEmployees();
    if (result.status === "success") {
      setAllEmployees(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employee</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddEmployee')}>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Employees..."
        value={searchText}
        // onChangeText={handleSearch}
      />

      <FlatList
        style={styles.employeeList}
        data={allEmployees}
        keyExtractor={(item) => item.employee_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <Text style={styles.employeeCode}>{item.employee_code}</Text>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeeEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },

  header: {
    height: 70,
    backgroundColor: '#0b6ffd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 22
  },

  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },

  profileIcon: {
    fontSize: 26,
    color: '#fff'
  },

  overlay: {
    flex: 1
  },
  employeeList: {
    marginTop: 10
  },
  searchInput: {
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    
  },
  employeeItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  employeeCode: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  employeeName: {
    fontSize: 16
  },
  employeeEmail: {
    fontSize: 14,
    color: '#666'
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 5,
    paddingVertical: 10,
    width: 120
  },

  menuItem: {
    padding: 10,
    fontSize: 16
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Employee

