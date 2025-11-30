const express = require('express');
const pool = require('../utils/db');
const result = require('../utils/result');
const router = express.Router();

// GET Employees (company only)
router.get('/employees', async (req, res) => {
    const company_id = req.headers.userid; // company.user_id from JWT
    try {
        const sql = `SELECT e.*, u.name, u.email, u.phone, u.pin_code 
                     FROM employees e 
                     JOIN users u ON e.user_id = u.id 
                     WHERE e.company_id = ? AND e.status = 1`;
        const [data] = await pool.query(sql, [company_id]);
        res.send(result.createResult(null, data));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// Add Employee (company only)
router.post('/employees', async (req, res) => {
    const { name, email, phone, pin_code, employee_code, department, designation } = req.body;
    const company_id = req.headers.userid;
    
    try {
        const sql = `INSERT INTO users (role, name, email, phone, password, pin_code, status) 
                     VALUES ('EMPLOYEE', ?, ?, ?, 'hashedpass', ?, 1)`;
        const [userData] = await pool.query(sql, [name, email, phone, pin_code]);
        
        const empSql = `INSERT INTO employees (user_id, company_id, employee_code, department, designation, status) 
                        VALUES (?, ?, ?, ?, ?, 1)`;
        await pool.query(empSql, [userData.insertId, company_id, employee_code, department, designation]);
        
        res.send(result.createResult(null, 'Employee added'));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// GET Vendors (company only)
router.get('/vendors', async (req, res) => {
    const company_id = req.headers.userid;
    try {
        const sql = `SELECT v.*, u.name as vendor_name, u.phone, u.email 
                     FROM vendors v 
                     JOIN users u ON v.user_id = u.id 
                     WHERE v.company_id = ? AND v.status = 1`;
        const [data] = await pool.query(sql, [company_id]);
        res.send(result.createResult(null, data));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// Add Vendor (company only)
router.post('/vendors', async (req, res) => {
    const { vendor_name, phone, location } = req.body;
    const company_id = req.headers.userid;
    
    try {
        const sql = `INSERT INTO users (role, name, phone, password, status) 
                     VALUES ('VENDOR', ?, ?, 'hashedpass', 1)`;
        const [userData] = await pool.query(sql, [vendor_name, phone]);
        
        const vendorSql = `INSERT INTO vendors (user_id, company_id, vendor_name, phone, location, status) 
                          VALUES (?, ?, ?, ?, ?, 1)`;
        await pool.query(vendorSql, [userData.insertId, company_id, vendor_name, phone, location]);
        
        res.send(result.createResult(null, 'Vendor added'));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// GET Coupon Masters (company only)
router.get('/coupons', async (req, res) => {
    const company_id = req.headers.userid;
    try {
        const sql = `SELECT * FROM coupon_master WHERE company_id = ?`;
        const [data] = await pool.query(sql, [company_id]);
        res.send(result.createResult(null, data));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// Assign Coupons to Employee
router.post('/assign-coupons', async (req, res) => {
    const { employee_id, coupon_master_id, allocated } = req.body;
    const company_id = req.headers.userid;
    
    try {
        const month_year = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const sql = `INSERT INTO employee_coupons (employee_id, coupon_master_id, month_year, allocated, remaining, created_at) 
                     VALUES (?, ?, ?, ?, ?, NOW()) 
                     ON DUPLICATE KEY UPDATE 
                     allocated = VALUES(allocated), 
                     remaining = VALUES(allocated) - used`;
        await pool.query(sql, [employee_id, coupon_master_id, month_year, allocated, allocated]);
        
        res.send(result.createResult(null, 'Coupons assigned'));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// Get Employee Coupons (for dashboard/reports)
router.get('/employee-coupons/:employee_id', async (req, res) => {
    const company_id = req.headers.userid;
    const employee_id = req.params.employee_id;
    try {
        const sql = `SELECT ec.*, cm.coupon_name, cm.coupon_value 
                     FROM employee_coupons ec
                     JOIN coupon_master cm ON ec.coupon_master_id = cm.id
                     WHERE ec.employee_id = ?`;
        const [data] = await pool.query(sql, [employee_id]);
        res.send(result.createResult(null, data));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

module.exports = router;
