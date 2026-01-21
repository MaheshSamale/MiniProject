const express = require('express');
const pool = require('../utils/db');
const result = require('../utils/result');
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const router = express.Router();


router.get('/employees', async (req, res) => {
    const company_id = req.headers.userid; 
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



router.post('/vendors', (req, res) => {
    console.log("Vendor Add");
    console.log(req.body);

    const { vendor_name, phone, location, email } = req.body;
    const company_id = req.body.user_id;
    console.log(company_id)

    // If email not provided, auto-generate one
    const vendorEmail = email ? email : `${vendor_name.toLowerCase()}_${Date.now()}@vendor.com`;

    const fixPass = vendor_name; // default password

    if (!vendor_name || !phone) {
        return res.send(result.createResult("vendor_name and phone are required"));
    }

    const userSql = `
        INSERT INTO users (role, name, email, phone, password, status)
        VALUES ('VENDOR', ?, ?, ?, ?, 1)
    `;

    bcrypt.hash(fixPass, config.SALTROUND, (err, hashedPassword) => {

        if (err) {
            return res.send(result.createResult(err));
        }

        pool.query(userSql, [vendor_name, vendorEmail, phone, hashedPassword], (err, userData) => {

            if (err) {
                return res.send(result.createResult(err));
            }

            const user_id = userData.insertId;

            const vendorSql = `
                INSERT INTO vendors (user_id, company_id, vendor_name, phone, location, status)
                VALUES (?, ?, ?, ?, ?, 1)
            `;

            pool.query(vendorSql,[user_id, company_id, vendor_name, phone, location],(err, vendorData) => {
                    if(err){
                          console.log(err);
                        return res.send(result.createResult(err, "error"));
                    }
                    return res.send(result.createResult(null, vendorData))
             
                }
            );
        });
    });
});





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
