import axios from 'axios';
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHeaders = async () => ({
    headers: { token: await AsyncStorage.getItem('token') }
});

export async function getMyCoupons() {
    try {
        const response = await axios.get(`${config.BASE_URL}/employee/my-coupons`, await getHeaders());
        return response.data;
    } catch (ex) {
        return { status: 'error', message: ex.message };
    }
}

export async function redeemCoupon(vendor_id, coupon_master_id, quantity) {
    try {
        const body = { vendor_id, coupon_master_id, quantity };
        console.log("Redeeming with Payload:", body); 
        const response = await axios.post(`${config.BASE_URL}/employee/redeem`, body, await getHeaders());
        return response.data;
    } catch (ex) {
        return { status: 'error', message: ex.response?.data?.message || "Redemption failed" };
    }
}


export async function getProfile() {
    try {
        const response = await axios.get(`${config.BASE_URL}/employee/profile`, await getHeaders());
        return response.data;
    } catch (ex) {
        return { status: 'error', message: ex.message };
    }
}


export async function getTransactions() {
    try {
        const response = await axios.get(`${config.BASE_URL}/employee/transactions`, await getHeaders());
        return response.data;
    } catch (ex) {
        return { status: 'error', message: ex.message };
    }
}