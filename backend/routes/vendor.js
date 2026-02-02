const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const { createResult } = require('../utils/result');

// 1. Get Vendor Profile (Includes the stored static QR image)
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user.id;
        // Select the qr_code_url column from your table
        const sql = `SELECT id, vendor_name, company_id, location, qr_code_url FROM vendors WHERE user_id = ?`;
        const [rows] = await pool.query(sql, [userId]);
        
        if (rows.length === 0) return res.status(404).json(createResult("Vendor not found"));
        
        const vendor = rows[0];

        // We return the qr_code_url which now contains the Base64 image string
        res.json(createResult(null, {
            id: vendor.id,
            vendor_name: vendor.vendor_name,
            company_id: vendor.company_id,
            location: vendor.location,
            qrCodeImage: vendor.qr_code_url // This will be the base64 string
        }));
    } catch (err) {
        res.status(500).json(createResult(err.message));
    }
});

// 2. Get My Transactions (Unchanged)
router.get('/my-transactions', async (req, res) => {
    try {
        const userId = req.user.id; // This is '2' for Central Cafeteria

        const sql = `
            SELECT 
                ct.id as transaction_id,
                u.name as employee_name,
                e.employee_code,
                cm.coupon_name,
                ct.coupons_used,
                (ct.coupons_used * cm.coupon_value) as total_value,
                ct.redeemed_at
            FROM coupon_transactions ct
            JOIN vendors v ON ct.vendor_id = v.id
            JOIN employees e ON ct.employee_id = e.id
            JOIN users u ON e.user_id = u.id
            JOIN coupon_master cm ON ct.coupon_master_id = cm.id
            WHERE v.user_id = ? 
            ORDER BY ct.redeemed_at DESC`;

        const [rows] = await pool.query(sql, [userId]);
        res.json(createResult(null, rows));
    } catch (err) {
        console.error(err);
        res.status(500).json(createResult(err.message));
    }
});

module.exports = router;