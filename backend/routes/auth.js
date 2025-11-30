const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
const result = require('../utils/result');
const config = require('../utils/config');
const router = express.Router();

// Login - COMPANY/EMPLOYEE/VENDOR
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    const sql = "SELECT * FROM users WHERE email = ?";


    pool.query(sql, [email], (err, data) => {
        console.log(data);
        
        if (err)
            res.send(result.createResult(err))
        else if (data.length == 0)
            res.send(result.createResult("Invalid Email"))
        else {
            bcrypt.compare(password, data[0].password, (err, passwordStatus) => {
                if (passwordStatus) {
                    const payload = {
                        id: data[0].id,
                    }
                    const token = jwt.sign(payload, config.SECRET)
                    const user = {
                        token,
                        role: data[0].role,
                        name: data[0].name,
                        email: data[0].email,
                        phone: data[0].phone
                    }
                    res.send(result.createResult(null, user))
                    console.log(user)
                }
                else
                    res.send(result.createResult('Invalid Password'))
            })
        }

    })

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



module.exports = router;
