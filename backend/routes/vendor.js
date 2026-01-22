const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const { createResult } = require('../utils/result');

// Get all redemptions for the logged-in vendor
router.get('/my-transactions', async (req, res) => {
    try {
        const userId = req.user.id; // Vendor's User ID from Token

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
        res.status(500).json(createResult(err.message));
    }
});

module.exports = router;