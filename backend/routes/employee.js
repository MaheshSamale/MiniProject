const express = require('express');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const QRCode = require('qrcode');
const crypto = require('crypto');
const router = express.Router();

// 10. VENDOR QR CODE
router.get('/qr', (req, res) => {
  const user_id = req.user.userId;
  pool.query('SELECT id FROM vendors WHERE user_id = ? AND status = 1', [user_id], async (err, vendorRows) => {
    if (err || vendorRows.length === 0) return res.json(createResult('Vendor not found'));
    const vendor_id = vendorRows[0].id;
    const qrData = { vendor_id, timestamp: Date.now(), token: crypto.randomBytes(16).toString('hex') };
    try {
      const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      res.json(createResult(null, { qr_url: qrUrl, data: qrData }));
    } catch (err) {
      res.json(createResult(err));
    }
  });
});

module.exports = router;