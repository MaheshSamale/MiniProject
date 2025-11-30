const jwt = require('jsonwebtoken');
const result = require('../utils/result');
const config = require('../utils/config');

function authorizeUser(req, res, next) {
    const url = req.url;
    // Skip auth for login/register
    if (url.includes('login')) return next();
    
    const token = req.headers.token;
    if (!token) return res.send(result.createResult('Token is Missing'));
    
    try {
        const payload = jwt.verify(token, config.SECRET);
        req.headers.userid = payload.userid;
        req.user = { role: payload.role };
        next();
    } catch (ex) {
        res.send(result.createResult('Invalid Token'));
    }
}

module.exports = authorizeUser;
