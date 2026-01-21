const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rutuja0802@',
    database: 'food_coupon_system'
})

module.exports = pool