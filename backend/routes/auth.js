const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const config = require('../utils/config');

// Universal Login for Company, Employee, and Vendor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query to find user and their specific ID from their role table
        const sql = `
            SELECT u.*, 
                   c.id as company_table_id,
                   e.id as employee_table_id, e.company_id as employee_comp_id,
                   v.id as vendor_table_id, v.company_id as vendor_comp_id
            FROM users u
            LEFT JOIN companies c ON u.id = c.user_id
            LEFT JOIN employees e ON u.id = e.user_id
            LEFT JOIN vendors v ON u.id = v.user_id
            WHERE u.email = ?`;

        const [rows] = await pool.query(sql, [email]);
        if (rows.length === 0) return res.json(createResult("User not found"));

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json(createResult("Invalid password"));

        // Determine the "Owned By" Company ID
        let companyId = user.company_table_id || user.employee_comp_id || user.vendor_comp_id;

        const payload = { 
            id: user.id, 
            role: user.role, 
            companyId: companyId 
        };

        const token = jwt.sign(payload, config.SECRET);

        res.json(createResult(null, {
            token,
            name: user.name,
            role: user.role,
            companyId: companyId
        }));
    } catch (err) {
        res.json(createResult(err.message));
    }
});

// Company Self-Registration
router.post('/register-company', async (req, res) => {
    try {
        const { company_name, name, email, phone, password, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, config.SALTROUND);

        const [userResult] = await pool.query(
            `INSERT INTO users (role, name, email, phone, password) VALUES ('COMPANY', ?, ?, ?, ?)`,
            [name, email, phone, hashedPassword]
        );

        await pool.query(
            `INSERT INTO companies (user_id, company_name, address) VALUES (?, ?, ?)`,
            [userResult.insertId, company_name, address]
        );

        res.json(createResult(null, "Company registered successfully"));
    } catch (err) {
        res.json(createResult(err.message));
    }
});

module.exports = router;