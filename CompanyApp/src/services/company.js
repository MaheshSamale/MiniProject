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
  const url = config.BASE_URL + '/company/dashboard/summary';
  const token = await AsyncStorage.getItem('token');
  
  try {
    const response = await axios.get(url, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Handle your API's createResult format
    if (response.data.status === 'success') {
      return response.data.data; // Return {statistics, recent_activity}
    } else {
      throw new Error(response.data.error || 'API Error');
    }
  } catch (error) {
    console.error('Dashboard API Error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.error || 'Failed to load dashboard');
    throw error;
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

// 1. Assign Coupon to Employee
export async function assignCoupon(employee_code, coupon_master_id, quantity, month_year) {
    try {
        const url = config.BASE_URL + '/company/assign-coupon';
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const body = { employee_code, coupon_master_id, quantity, month_year };
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to assign coupon');
    }
}

// 2. Create New Coupon Type (Master)
export async function createCouponMaster(coupon_name, monthly_limit, coupon_value) {
    try {
        const url = config.BASE_URL + '/company/create-coupon-master';
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const body = { coupon_name, monthly_limit, coupon_value };
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to create coupon master');
    }
}

// 3. Get Vendor Settlement Report
export async function getVendorSettlementReport(month_year) {
    try {
        // Appending query parameter for month_year
        const url = `${config.BASE_URL}/company/reports/vendor-settlement?month_year=${month_year}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch settlement report');
    }
}

// 4. Search Employees
export async function searchEmployees(query) {
    try {
        const url = `${config.BASE_URL}/company/employees/search?query=${query}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        // Search errors are often just "no results", so maybe don't alert here or handle gracefully
        return null; 
    }
}

// 5. Get Single Employee Details
export async function getEmployeeById(id) {
    try {
        const url = `${config.BASE_URL}/company/employees/${id}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch employee details');
    }
}

// 6. Get Single Vendor Details
export async function getVendorById(id) {
    try {
        const url = `${config.BASE_URL}/company/vendors/${id}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch vendor details');
    }
}

// Delete Employee
export async function deleteEmployee(id) {
    try {
        const url = `${config.BASE_URL}/company/employees/${id}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.delete(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        // Alert handled in UI or here
        return { status: 'error', error: 'Failed to delete employee' };
    }
}

// Delete Vendor
export async function deleteVendor(id) {
    try {
        const url = `${config.BASE_URL}/company/vendors/${id}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.delete(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        return { status: 'error', error: 'Failed to delete vendor' };
    }
}

// 1. Get All Coupon Master records (Inventory)
// Endpoint: GET /coupons/master
export async function getAllCouponsMaster() {
    try {
        const url = `${config.BASE_URL}/company/coupons/master`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch coupon types');
        return null;
    }
}

// 2. Get Assigned Coupons for a Specific Employee (Wallet)
// Endpoint: GET /employees/:id/coupons
export async function getEmployeeCoupons(employeeId) {
    try {
        const url = `${config.BASE_URL}/company/employees/${employeeId}/coupons`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch employee wallet');
        return null;
    }
}

// 3. Get Redemption Details for a Specific Vendor
// Endpoint: GET /vendors/:id/redemptions
export async function getVendorRedemptions(vendorId) {
    try {
        const url = `${config.BASE_URL}/company/vendors/${vendorId}/redemptions`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch vendor redemptions');
        return null;
    }
}

// 4. Detailed Settlement API (Daily Breakdown for a Vendor)
// Endpoint: GET /reports/vendor-daily-settlement
export async function getVendorDailySettlement(vendorId, monthYear) {
    try {
        // monthYear should be in 'YYYY-MM' format
        const url = `${config.BASE_URL}/company/reports/vendor-daily-settlement?vendor_id=${vendorId}&month_year=${monthYear}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.get(url, { headers });
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to fetch daily settlement report');
        return null;
    }
}

// Delete Coupon Master
export async function deleteCouponMaster(id) {
    try {
        const url = `${config.BASE_URL}/company/coupons/master/${id}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.delete(url, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        if (ex.response && ex.response.data) {
            return ex.response.data; 
        }
        return { status: 'error', error: 'Failed to delete coupon type' };
    }
}

// Regenerate QR Code for a Vendor
export async function regenerateVendorQR(vendorId) {
    try {
        const url = `${config.BASE_URL}/company/generate-vendor-qr/${vendorId}`;
        const headers = {
            token: await AsyncStorage.getItem('token')
        };
        const response = await axios.post(url, {}, { headers });
        return response.data;
    } catch (ex) {
        console.log(ex);
        Alert.alert('Error', 'Failed to generate QR code');
        return { status: 'error', error: ex.message };
    }
}