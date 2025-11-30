const express = require('express');
const pool = require('../utils/db');
const result = require('../utils/result');
const router = express.Router();

// Add Employee (company only)
router.post('/employees', async (req, res) => {
    const { name, email, phone, pin_code, employee_code, department } = req.body;
    const company_id = req.headers.userid; // company user id
    try {
        const sql = `INSERT INTO users (role, name, email, phone, password, pin_code) 
                     VALUES ('EMPLOYEE', ?, ?, ?, ?, ?)`;
        const [userData] = await pool.query(sql, [name, email, 'hashedpass', phone, pin_code]);
        
        const empSql = `INSERT INTO employees (user_id, company_id, employee_code, department) 
                        VALUES (?, ?, ?, ?)`;
        await pool.query(empSql, [userData.insertId, company_id, employee_code, department]);
        res.send(result.createResult(null, 'Employee added'));
    } catch (err) {
        res.send(result.createResult(err));
    }
});

// Add Vendor (company only)
router.post('/vendors', async (req, res) => {
    // Similar pattern - create user + vendor record
});

// Assign Coupons
router.post('/assign-coupons', async (req, res) => {
    // employee_id, coupon_master_id, allocated
});

module.exports = router;
