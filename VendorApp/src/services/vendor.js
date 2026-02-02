import axios from 'axios';
import  config  from  './config'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Fetch Vendor Profile (includes QR data)
export async function getVendorProfile() {
    try {
        const url = `${config.BASE_URL}/vendor/profile`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log("Profile Fetch Error:", ex);
        return null;
    }
}

export async function getMyTransactions() {
    try {
        const url = `${config.BASE_URL}/vendor/my-transactions`;
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
            console.error("No token found in storage");
            return [];
        }

        const response = await axios.get(url, {
            headers: { 
                'token': token // Ensure this matches your backend middleware
            }
        });

        // Log the full response to see what exactly is coming back
        console.log("API Response:", JSON.stringify(response.data, null, 2));

        if (response.data && response.data.status === 'success') {
            return response.data.data; 
        }
        return [];
    } catch (ex) {
        console.error("Fetch Transactions Error:", ex.response ? ex.response.data : ex.message);
        return [];
    }
}