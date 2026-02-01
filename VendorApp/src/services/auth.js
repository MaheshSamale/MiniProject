import axios from 'axios';
import  config  from  './config'
import { Alert } from 'react-native';

export async function loginVendor(email, password) {
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


