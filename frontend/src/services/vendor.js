import axios from 'axios';
import { config } from './config';

export async function getVendors(token) {
    try {
        const response = await axios.get(config.BASE_URL + '/company/vendors', {
            headers: { token }
        });
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

export async function addVendor(vendorData, token) {
    try {
        const response = await axios.post(config.BASE_URL + '/company/vendors', vendorData, {
            headers: { token }
        });
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}
