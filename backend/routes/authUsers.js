const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const config = require('../utils/config');
const { authorizeUser } = require('../middleware/auth');

// Universal Login for Company, Employee, and Vendor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- DEBUG LOGS ---
        console.log("\n>>> LOGIN ATTEMPT <<<");
        console.log("Email:", email);
        console.log("Password Received:", password);

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
        if (rows.length === 0) {
            console.log("Result: User not found in DB");
            return res.json(createResult("User not found"));
        }

        const user = rows[0];
        console.log("Stored Hash in DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Bcrypt Match Result:", isMatch);
        console.log("---------------------\n");

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
        console.error("Login Error:", err);
        res.json(createResult(err.message));
    }
});

// Company Self-Registration
router.post('/register-company', async (req, res) => {
    try {
        const { company_name, name, email, phone, password, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, parseInt(config.SALTROUND) || 10);

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

// Update Password (logged in)
router.post('/update-password', authorizeUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; 

        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.json(createResult("User not found"));

        const user = rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.json(createResult("Old password does not match"));

        const hashedNewPassword = await bcrypt.hash(newPassword, parseInt(config.SALTROUND) || 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json(createResult(null, "Password updated successfully"));
    } catch (err) {
        console.error("Update Password Error:", err);
        res.json(createResult(err.message));
    }
});

// Reset Password via Mobile (Forgot Password)
router.post('/reset-password-mobile', async (req, res) => {
    try {
        const { phone, newPassword } = req.body;

        // 1. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 2. Perform update and capture the result
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE phone = ?', 
            [hashedPassword, phone]
        );

        // --- DEBUG LOGS ---
        console.log("\n>>> RESET ATTEMPT VERIFICATION <<<");
        console.log("Phone Target:", phone);
        console.log("Rows Affected:", result.affectedRows);
        console.log("----------------------------------\n");

        if (result.affectedRows === 0) {
            return res.json(createResult("Error: Phone number not found in current database."));
        }

        res.json(createResult(null, "Password reset successfully."));
    } catch (err) {
        console.error("Reset API Error:", err);
        res.json(createResult(err.message));
    }
});

module.exports = router;