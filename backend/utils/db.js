const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mahesh@123',
    database: 'food_coupon_system',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise(); // Important for async/await