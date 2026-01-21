import axios from 'axios';
import  config  from  './config'
import { Alert } from 'react-native';

export async function loginCompany(email, password) {
    try {
        const body = { email, password };
        const url = config.BASE_URL + '/auth/login';
        const response = await axios.post(url, body);
        return response.data;
    } catch (ex) {
        Alert.alert('Error', 'Login failed');
        throw ex;
    }
}

export async function registerCompany(company_name, name, email, phone, password, address) {
    try {
        const url = config.BASE_URL + '/auth/register-company';
        console.log(url);
        const body = { company_name, name, email, phone, password, address };
        const response = await axios.post(url, body);
        console.log(response.data);
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Registration failed');
        throw ex;
    }
}
