import axios from 'axios';
import { config } from './config';
import { toast } from 'react-toastify'; // if using toast

export async function loginCompany(email, password) {
    try {
        const body = { email, password };
        const url = config.BASE_URL + '/auth/login';
        const response = await axios.post(url, body);
        return response.data;
    } catch (ex) {
        console.log(ex);
        toast.error('Login failed');
        throw ex;
    }
}

export async function registerCompany(company_name, name, email, phone, password, address) {
    try {
        const url = config.BASE_URL + '/auth/register-company';
        const body = { company_name, name, email, phone, password, address };
        const response = await axios.post(url, body);
        return response.data;
    } catch (ex) {
        console.log(ex);
        toast.error('Registration failed');
        throw ex;
    }
}
