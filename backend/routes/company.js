const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const config = require('../utils/config');

// Helper to create sub-users (Employees/Vendors) with Transaction support
async function createSubUser(req, role, extraFields) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { name, email, phone, password } = req.body;
        const companyId = req.user.companyId;

        const hashedPassword = await bcrypt.hash(password, config.SALTROUND);
        
        // 1. Insert into Users
        const [uRes] = await connection.query(
            `INSERT INTO users (role, name, email, phone, password, status) VALUES (?, ?, ?, ?, ?, 1)`,
            [role, name, email, phone, hashedPassword]
        );

        // 2. Insert into Specific Table
        if (role === 'EMPLOYEE') {
            await connection.query(
                `INSERT INTO employees (user_id, company_id, employee_code, department, designation) VALUES (?, ?, ?, ?, ?)`,
                [uRes.insertId, companyId, extraFields.code.trim(), extraFields.dept, extraFields.desig]
            );
        } else {
            await connection.query(
                `INSERT INTO vendors (user_id, company_id, vendor_name, phone, location) VALUES (?, ?, ?, ?, ?)`,
                [uRes.insertId, companyId, name, phone, extraFields.location]
            );
        }

        await connection.commit();
        return { email, password };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

// Add Employee
router.post('/add-employee', async (req, res) => {
    try {
        const credentials = await createSubUser(req, 'EMPLOYEE', {
            code: req.body.employee_code,
            dept: req.body.department,
            desig: req.body.designation
        });
        res.json(createResult(null, { message: "Employee Created Successfully", credentials }));
    } catch (err) {
        res.json(createResult(err.message));
    }
});

// Assign Coupon (Fixed with TRIM and Company Validation)
router.post('/assign-coupon', async (req, res) => {
    try {
        const { employee_code, coupon_master_id, quantity, month_year } = req.body;
        const company_id = req.user.companyId;

        // 1. Internal Lookup with Case-Insensitivity and Trim
        const [empRows] = await pool.query(
            "SELECT id FROM employees WHERE UPPER(TRIM(employee_code)) = UPPER(TRIM(?)) AND company_id = ?",
            [employee_code, company_id]
        );

        if (empRows.length === 0) {
            return res.json(createResult(`Employee code '${employee_code}' not found for your company (ID: ${company_id}).`));
        }

        const employee_id = empRows[0].id;

        // 2. Validate Coupon Ownership
        const [couponCheck] = await pool.query(
            "SELECT id FROM coupon_master WHERE id = ? AND company_id = ?",
            [coupon_master_id, company_id]
        );

        if (couponCheck.length === 0) {
            return res.json(createResult("Access Denied: This coupon type does not belong to your company."));
        }

        // 3. Upsert Allocation
        const sql = `
            INSERT INTO employee_coupons (employee_id, coupon_master_id, month_year, allocated, remaining)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            allocated = allocated + VALUES(allocated),
            remaining = remaining + VALUES(allocated)`;

        await pool.query(sql, [employee_id, coupon_master_id, month_year, quantity, quantity]);

        res.json(createResult(null, `Successfully assigned ${quantity} coupons to ${employee_code}`));
    } catch (err) {
        res.status(500).json(createResult(err.message));
    }
});

// FIXED: Added the missing Add Vendor API
router.post('/add-vendor', async (req, res) => {
  try {
      const credentials = await createSubUser(req, 'VENDOR', {
          location: req.body.location
      });
      res.json(createResult(null, { message: "Vendor Created Successfully", credentials }));
  } catch (err) {
      res.json(createResult(err.message));
  }
});

// GET ROUTES (Vendors/Employees)
router.get('/employees', async (req, res) => {
    const [rows] = await pool.query(
        `SELECT e.id as employee_id, e.employee_code, u.name, u.email, e.department FROM employees e JOIN users u ON e.user_id = u.id WHERE e.company_id = ?`,
        [req.user.companyId]
    );
    res.json(createResult(null, rows));
});

router.get('/vendors', async (req, res) => {
  try {
      const [rows] = await pool.query(
          `SELECT v.id as vendor_id, v.vendor_name, u.email, v.location, v.status 
           FROM vendors v 
           JOIN users u ON v.user_id = u.id 
           WHERE v.company_id = ?`,
          [req.user.companyId]
      );
      res.json(createResult(null, rows));
  } catch (err) {
      res.json(createResult(err.message));
  }
});


router.post('/create-coupon-master', async (req, res) => {
    try {
        const { coupon_name, monthly_limit, coupon_value } = req.body;
        await pool.query(
            `INSERT INTO coupon_master (company_id, coupon_name, monthly_limit, coupon_value) VALUES (?, ?, ?, ?)`,
            [req.user.companyId, coupon_name, monthly_limit, coupon_value]
        );
        res.json(createResult(null, "Coupon Master created"));
    } catch (err) {
        res.json(createResult(err.message));
    }
});


// Get Monthly Settlement Report for All Vendors
router.get('/reports/vendor-settlement', async (req, res) => {
  try {
      const companyId = req.user.companyId;
      const { month_year } = req.query; // Expecting '2026-01'

      if (!month_year) {
          return res.json(createResult("Please provide month_year as a query parameter (e.g., ?month_year=2026-01)"));
      }

      const sql = `
          SELECT 
              v.id as vendor_id,
              v.vendor_name,
              v.location,
              COUNT(ct.id) as total_redemptions,
              SUM(ct.coupons_used) as total_coupons_redeemed,
              SUM(ct.coupons_used * cm.coupon_value) as total_amount_payable
          FROM vendors v
          LEFT JOIN coupon_transactions ct ON v.id = ct.vendor_id 
              AND DATE_FORMAT(ct.redeemed_at, '%Y-%m') = ?
          LEFT JOIN coupon_master cm ON ct.coupon_master_id = cm.id
          WHERE v.company_id = ?
          GROUP BY v.id, v.vendor_name, v.location
          ORDER BY total_amount_payable DESC`;

      const [rows] = await pool.query(sql, [month_year, companyId]);
      res.json(createResult(null, {
          billing_period: month_year,
          report: rows
      }));
  } catch (err) {
      res.status(500).json(createResult(err.message));
  }
});



// Company Admin Dashboard Statistics
router.get('/dashboard/summary', async (req, res) => {
  try {
      const companyId = req.user.companyId;

      // Query to get overall stats
      const statsSql = `
          SELECT 
              (SELECT COUNT(*) FROM employees WHERE company_id = ?) as total_employees,
              (SELECT COUNT(*) FROM vendors WHERE company_id = ?) as total_vendors,
              (SELECT IFNULL(SUM(remaining), 0) FROM employee_coupons ec 
               JOIN employees e ON ec.employee_id = e.id 
               WHERE e.company_id = ?) as total_coupons_in_wallets,
              (SELECT IFNULL(SUM(coupons_used), 0) FROM coupon_transactions 
               WHERE company_id = ?) as total_coupons_redeemed_ever
      `;

      const [stats] = await pool.query(statsSql, [companyId, companyId, companyId, companyId]);

      // Query to get recent 5 transactions for the "Activity Feed"
      const recentActivitySql = `
          SELECT 
              u.name as employee_name,
              v.vendor_name,
              ct.coupons_used,
              ct.redeemed_at
          FROM coupon_transactions ct
          JOIN employees e ON ct.employee_id = e.id
          JOIN users u ON e.user_id = u.id
          JOIN vendors v ON ct.vendor_id = v.id
          WHERE ct.company_id = ?
          ORDER BY ct.redeemed_at DESC
          LIMIT 5`;

      const [recentActivity] = await pool.query(recentActivitySql, [companyId]);

      res.json(createResult(null, {
          statistics: stats[0],
          recent_activity: recentActivity
      }));
  } catch (err) {
      res.status(500).json(createResult(err.message));
  }
});



// Search Employees by Name, Email, or Employee Code
router.get('/employees/search', async (req, res) => {
  try {
      const companyId = req.user.companyId;
      const { query } = req.query; // The search term from Postman/Frontend

      if (!query || query.length < 2) {
          return res.json(createResult("Search query must be at least 2 characters long."));
      }

      const searchTerm = `%${query}%`;

      const sql = `
          SELECT 
              e.id as employee_id,
              e.employee_code,
              u.name,
              u.email,
              e.department,
              e.designation
          FROM employees e
          JOIN users u ON e.user_id = u.id
          WHERE e.company_id = ? 
          AND (u.name LIKE ? OR u.email LIKE ? OR e.employee_code LIKE ?)
          LIMIT 10`;

      const [rows] = await pool.query(sql, [companyId, searchTerm, searchTerm, searchTerm]);
      
      res.json(createResult(null, rows));
  } catch (err) {
      res.status(500).json(createResult(err.message));
  }
});

module.exports = router;