const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
const  result  = require('../utils/result');
const config = require('../utils/config');
const router = express.Router();

// Login - COMPANY/EMPLOYEE/VENDOR
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  // ✅ JOIN users + companies to get company_id
  const sql = `SELECT u.*, c.id as company_id 
               FROM users u 
               LEFT JOIN companies c ON c.user_id = u.id 
               WHERE u.email = ?`;
  
  pool.query(sql, [email], (err, data) => {
      console.log(data);
      
      if (err)
          res.send(result.createResult(err))
      else if (data.length == 0)
          res.send(result.createResult("Invalid Email"))
      else {
          bcrypt.compare(password, data[0].password, (err, passwordStatus) => {
              if (passwordStatus) {
                  // ✅ JWT payload includes companyId (companies.id)
                  const payload = {
                      id: data[0].id,           // users.id (companies.user_id)
                      companyId: data[0].company_id,  // companies.id ← KEY!
                      role: data[0].role
                  };
                  const token = jwt.sign(payload, config.SECRET);
                  
                  // ✅ Response includes companyId for frontend
                  const user = {
                      token,
                      role: data[0].role,
                      name: data[0].name,
                      email: data[0].email,
                      phone: data[0].phone,
                      companyId: data[0].company_id  // ← CRITICAL
                  };
                  res.send(result.createResult(null, user));
                  console.log('Login success:', user);
              }
              else
                  res.send(result.createResult('Invalid Password'))
          })
      }
  });
});





router.post('/register-company', async (req, res) => {
    const { company_name, name, email, phone, password , address } = req.body;
    console.log('Company register:', email);
    
    const userSql = `INSERT INTO users (role, name, email, phone, password) 
                     VALUES ('COMPANY', ?, ?, ?, ?)`;
    
    bcrypt.hash(password, config.SALTROUND, (err, hashedPassword) => {
        if (hashedPassword) {
            pool.query(userSql, [name, email, phone, hashedPassword], (err, userData) => {
                if (err) return res.send(result.createResult(err));
                
                const companySql = `INSERT INTO companies (user_id, company_name, address) 
                                   VALUES (?, ?, ?)`;
                pool.query(companySql, [userData.insertId, company_name, address], (err, companyData) => {
                    res.send(result.createResult(err, companyData));
                });
            }); 
        } else {
            res.send(result.createResult(err));
        }
    });
});

// 3. EMPLOYEE PIN LOGIN
router.post('/employee-login', (req, res) => {
  const { pin } = req.body;
  const sql = `SELECT u.*, e.id as employee_id, e.company_id, c.id as company_id 
               FROM users u JOIN employees e ON e.user_id = u.id JOIN companies c ON e.company_id = c.id 
               WHERE u.pin_code = ? AND u.status = 1 AND e.status = 1`;
  pool.query(sql, [pin], (err, data) => {
    if (err || data.length === 0) return res.json(createResult('Invalid PIN'));
    const payload = { userId: data[0].id, role: 'EMPLOYEE', companyId: data[0].company_id, employeeId: data[0].employee_id };
    const token = jwt.sign(payload, config.SECRET);
    res.json(createResult(null, { token, role: 'EMPLOYEE', name: data[0].name, employee_id: data[0].employee_id }));
  });
});

module.exports = router;
