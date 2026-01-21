const express = require('express');
const crypto = require('crypto');
const config = require('../utils/config');
const bcrypt = require('bcrypt');
const pool = require('../utils/db');
const {authorizeUser} = require('../middleware/auth')
const  result  = require('../utils/result');
const router = express.Router();


// ✅ POST /api/company/employees - Add Employee with Hashed Password
router.post('/employees', (req, res) => {
  const company_id = req.user.companyId;  // ← PHPD=7
  const { name, email, phone, employee_code, department, designation } = req.body;
  
  // 1. Generate secure random password (12 chars)
  const temp_password = 'pass@'+employee_code;
  
  // 2. Hash password
  bcrypt.hash(temp_password, config.SALTROUND, (hashErr, hashedPassword) => {
      if (hashErr) {
          return res.send(result.createResult(hashErr));
      }
      
      // 3. Generate random 6-digit PIN
      const pin_code = Math.floor(100000 + Math.random() * 900000).toString();
      
      pool.getConnection((err, connection) => {
          if (err) {
              connection?.release();
              return res.send(result.createResult(err));
          }
          
          // 4. Create EMPLOYEE user with hashed password
          const userSql = `INSERT INTO users (role, name, email, phone, password, pin_code, status) 
                           VALUES ('EMPLOYEE', ?, ?, ?, ?, ?, 1)`;
          connection.query(userSql, [name, email, phone, hashedPassword, pin_code], (err, userData) => {
              if (err) {
                  connection.release();
                  return res.send(result.createResult(err));
              }
              
              const user_id = userData.insertId;
              
              // 5. Create employee record
              const empSql = `INSERT INTO employees (user_id, company_id, employee_code, department, designation, status) 
                              VALUES (?, ?, ?, ?, ?, 1)`;
              connection.query(empSql, [user_id, company_id, employee_code, department, designation], (err, empData) => {
                  connection.release();
                  if (err) {
                      return res.send(result.createResult(err));
                  }
                  
                  // ✅ Return hashed password + email
                  res.send(result.createResult(null, { 
                      employee_id: empData.insertId, 
                      user_id, 
                      pin_code,
                      employee_email: email,
                      temp_password: temp_password  // ← Secure hashed version
                  }));
              });
          });
      });
  });
});



// In routes/company.js
router.get('/my-profile', authorizeUser, async (req, res) => {
  try {
      const sql = "SELECT * FROM companies WHERE user_id = ?";
      // Using mysql2/promise for 2026 async/await standards
      const [data] = await pool.query(sql, [req.userId]);

      if (data.length === 0) return res.status(404).send("Company profile not found");
      
      const company_id = data[0].id;
      res.send(result.createResult(null, { company_id, ...data[0] }));
  } catch (err) {
      res.status(500).send(result.createResult(err.message));
  }
});


// ✅ GET /api/company/employees - List Employees (bonus)
router.get('/employees', (req, res) => {
  const company_id = req.user.companyId;
  const sql = `SELECT e.*, u.name, u.email, u.phone, u.pin_code 
               FROM employees e 
               JOIN users u ON e.user_id = u.id 
               WHERE e.company_id = ? AND e.status = 1`;
  
  pool.query(sql, [company_id], (err, data) => {
      res.send(result.createResult(err, data));
  });
});
module.exports = router;
