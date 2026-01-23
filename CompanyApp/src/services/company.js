import axios from 'axios';
import  config  from  './config'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerEmployee( name, email, password, employee_code, department) {
    try {
        const url = config.BASE_URL + '/company/add-employee';
        const headers = {
            token: await AsyncStorage.getItem('token')
        }
        const body = { name, email, password, employee_code, department };
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to add employee');
    }
}

export async function registerVendor( name, email, phone, password, location) {
    try {
        const url = config.BASE_URL + '/company/add-vendor';
        const headers = {
            token: await AsyncStorage.getItem('token')
        }
        const body = { name, email, phone, password, location };
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (ex) {
        Alert.alert('Error', 'Failed to add vendor');
    }
}

export async function getDashboardSummary() {
    const url = config.BASE_URL + '/company/dashboard/summary'
    const headers = {
        token: await AsyncStorage.getItem('token')
    }
    try {
        const response = await axios.get(url, {headers})
        return response.data
    } catch (error) {
        Alert.error(error)
    }
}

export async function getAllEmployees() {
    const url = config.BASE_URL + '/company/employees'
    const headers = {
        token: await AsyncStorage.getItem('token')
    }
    try {
        const response = await axios.get(url, {headers})
        return response.data
    } catch (error) {
        Alert.error(error)
    }
}

export async function getAllVendors() {
    const url = config.BASE_URL + '/company/vendors'
    const headers = {
        token: await AsyncStorage.getItem('token')
    }
    try {
        const response = await axios.get(url, {headers})
        return response.data
    } catch (error) {
        Alert.error(error)
    }
}