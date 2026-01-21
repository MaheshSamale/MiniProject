const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { createResult } = require('../utils/result');

function authorizeUser(req, res, next) {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1];
  
  if (req.url.includes('login') || req.url.includes('register')) return next();

  if (!token) {
    return res.json(createResult(null, 'Token is Missing'));
  }

  try {
    const payload = jwt.verify(token, config.SECRET);
    req.user = payload;
    next();
  } catch (ex) {
    res.json(createResult('Invalid Token'));
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
