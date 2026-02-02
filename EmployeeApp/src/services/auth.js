import axios from 'axios';
import config from './config';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHeaders = async () => ({
    headers: { token: await AsyncStorage.getItem('token') }
});

export async function loginEmployee(email, password) {
    try {
        const body = { email, password };
        const url = config.BASE_URL + '/auth/login';

        // --- DEBUG LOGS ---
        console.log("Attempting Login...");
        console.log("URL:", url);
        console.log("Payload:", body);
        // ------------------

        const response = await axios.post(url, body);

        // --- DEBUG LOGS ---
        console.log("Server Response:", response.data);
        // ------------------

        return response.data;
    } catch (ex) {
        console.error("Login API Error:", ex.response ? ex.response.data : ex.message);
        Alert.alert('Error', 'Login failed');
        throw ex;
    }
}

export async function updatePassword(oldPassword, newPassword) {
    try {
        console.log("Updating Password...");
        const response = await axios.post(
            `${config.BASE_URL}/auth/update-password`, 
            { oldPassword, newPassword }, 
            await getHeaders()
        );
        console.log("Update Password Response:", response.data);
        return response.data;
    } catch (ex) {
        console.error("Update Password Error:", ex.message);
        return { status: 'error', message: ex.message };
    }
}

export async function resetPasswordByMobile(phone, newPassword) {
    try {
        console.log("Resetting Password for phone:", phone);
        const response = await axios.post(`${config.BASE_URL}/auth/reset-password-mobile`, { 
            phone, 
            newPassword 
        });
        console.log("Reset Response:", response.data);
        return response.data;
    } catch (ex) {
        console.error("Reset Password Error:", ex.response?.data || ex.message);
        return { 
            status: 'error', 
            error: ex.response?.data?.error || "Server connection failed" 
        };
    }
}