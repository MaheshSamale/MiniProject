const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const { createResult } = require('../utils/result');

// 1. View My Assigned Coupons (Wallet)
router.get('/my-coupons', async (req, res) => {
    try {
        const userId = req.user.id;
  
        const sql = `
            SELECT 
                ec.id as allocation_id,
                cm.id as coupon_master_id, -- Added this line
                cm.coupon_name,
                cm.coupon_value,
                ec.month_year,
                ec.allocated,
                ec.used,
                ec.remaining
            FROM employee_coupons ec
            JOIN coupon_master cm ON ec.coupon_master_id = cm.id
            JOIN employees e ON ec.employee_id = e.id
            WHERE e.user_id = ? AND ec.remaining > 0
            ORDER BY ec.month_year DESC, ec.created_at DESC`;
  
        const [rows] = await pool.query(sql, [userId]);
        res.json(createResult(null, rows));
    } catch (err) {
        res.status(500).json(createResult(err.message));
    }
  });


// 2. Redeem Coupon (Fixed for Generated Columns)
router.post('/redeem', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { vendor_id, coupon_master_id, quantity } = req.body;
        const userId = req.user.id;

        // 1. Get Employee context
        const [empRows] = await connection.query(
            "SELECT id, company_id FROM employees WHERE user_id = ?", 
            [userId]
        );
        if (empRows.length === 0) throw new Error("Employee profile not found.");
        
        const employeeId = empRows[0].id;
        const companyId = empRows[0].company_id;

        // 2. Verify Vendor belongs to the same company
        const [vendorCheck] = await connection.query(
            "SELECT id FROM vendors WHERE id = ? AND company_id = ?",
            [vendor_id, companyId]
        );
        if (vendorCheck.length === 0) throw new Error("This vendor is not authorized for your company.");

        // 3. Check Wallet
        // We still check 'remaining' here because we need to know if they HAVE enough,
        // but we don't try to UPDATE it manually later.
        const [wallet] = await connection.query(
            "SELECT id, remaining FROM employee_coupons WHERE employee_id = ? AND coupon_master_id = ? AND remaining >= ? FOR UPDATE",
            [employeeId, coupon_master_id, quantity]
        );

        if (wallet.length === 0) throw new Error("Insufficient coupon balance.");

        // 4. Execute Transaction
        // FIX: Removed 'remaining = remaining - ?'. 
        // Just increment 'used'. The DB handles the 'remaining' math.
        await connection.query(
            "UPDATE employee_coupons SET used = used + ? WHERE id = ?",
            [quantity, wallet[0].id]
        );

        await connection.query(
            `INSERT INTO coupon_transactions (employee_id, vendor_id, company_id, coupon_master_id, coupons_used) 
             VALUES (?, ?, ?, ?, ?)`,
            [employeeId, vendor_id, companyId, coupon_master_id, quantity]
        );

        await connection.commit();
        res.json(createResult(null, "Redemption successful!"));
    } catch (err) {
        await connection.rollback();
        res.status(400).json(createResult(err.message));
    } finally {
        connection.release();
    }
});


// 3. Get Employee Profile
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user.id;

        const sql = `
            SELECT 
                u.name,
                u.email,
                u.phone,
                e.employee_code,
                e.department,
                e.designation,
                c.company_name
            FROM employees e
            JOIN users u ON e.user_id = u.id
            JOIN companies c ON e.company_id = c.id
            WHERE e.user_id = ?`;

        const [rows] = await pool.query(sql, [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json(createResult("Employee profile not found"));
        }

        res.json(createResult(null, rows[0]));
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json(createResult(err.message));
    }
});


// Get My Recent Transactions
router.get('/transactions', async (req, res) => {
    try {
        const userId = req.user.id;

        const sql = `
            SELECT 
                ct.id,
                v.vendor_name,
                cm.coupon_name,
                ct.coupons_used,
                (ct.coupons_used * cm.coupon_value) as total_value,
                ct.redeemed_at
            FROM coupon_transactions ct
            JOIN employees e ON ct.employee_id = e.id
            JOIN vendors v ON ct.vendor_id = v.id
            JOIN coupon_master cm ON ct.coupon_master_id = cm.id
            WHERE e.user_id = ?
            ORDER BY ct.redeemed_at DESC
            LIMIT 20`;

        const [rows] = await pool.query(sql, [userId]);
        res.json(createResult(null, rows));
    } catch (err) {
        res.status(500).json(createResult(err.message));
    }
});


module.exports = router;