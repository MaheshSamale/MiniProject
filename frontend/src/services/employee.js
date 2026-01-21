import axios from 'axios';
import { config } from './config';

// Your frontend expects this response format
export async function getEmployees(token) {
    try {
        const response = await axios.get(config.BASE_URL + '/company/employees', {
            headers: { token }
        });
        return response.data; // { success: true, data: [...] }
    } catch (ex) {
        throw ex;
    }
}


export async function addEmployee(employeeData, token) {
    try {
        const response = await axios.post(config.BASE_URL + '/company/employees', employeeData, {
            headers: { token }
        });
        return response.data;
    } catch (ex) {
       
        throw ex;
    }
}
