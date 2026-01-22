const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { createResult } = require('../utils/result'); // Destructured here

function authorizeUser(req, res, next) {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1];
  
  if (req.originalUrl.includes('login') || req.originalUrl.includes('register')) return next();

  if (!token) {
    return res.json(createResult('Token is Missing')); // Fixed: call directly
  }

  try {
    const payload = jwt.verify(token, config.SECRET);
    req.user = payload; 
    next();
  } catch (ex) {
    res.json(createResult('Invalid Token')); // Fixed: call directly
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
