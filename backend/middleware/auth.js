const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { createResult } = require('../utils/result');

function authorizeUser(req, res, next) {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1];
  
  // Skip public routes - FIXED: use req.originalUrl
  if (req.originalUrl.includes('login') || req.originalUrl.includes('register')) return next();

  if (!token) {
    return res.json(result.createResult(null, 'Token is Missing'));  // result. prefix
  }

  try {
    const payload = jwt.verify(token, config.SECRET);
    req.user = payload;  // ✅ {id, companyId, role}
    next();
  } catch (ex) {
    res.json(result.createResult('Invalid Token'));
  }
}


function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.json(createResult('Forbidden'));
    }
    next();
  };
}

module.exports = { authorizeUser, allowRoles };
