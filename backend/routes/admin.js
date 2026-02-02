const QRCode = require('qrcode');

// Admin API to (re)generate a static QR code for a vendor
// POST /api/admin/generate-vendor-qr/:vendorId
router.post('/generate-vendor-qr/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;

        // 1. Get vendor details
        const [vendors] = await pool.query(
            'SELECT id, vendor_name, company_id FROM vendors WHERE id = ?', 
            [vendorId]
        );

        if (vendors.length === 0) return res.json(createResult("Vendor not found"));
        const vendor = vendors[0];

        // 2. Define the data to be encoded in the QR
        const qrData = JSON.stringify({
            vendor_id: vendor.id,
            company_id: vendor.company_id,
            vendor_name: vendor.vendor_name
        });

        // 3. Generate Base64 Image string
        const base64Image = await QRCode.toDataURL(qrData);

        // 4. Store in database
        await pool.query(
            'UPDATE vendors SET qr_code_url = ? WHERE id = ?', 
            [base64Image, vendorId]
        );

        res.json(createResult(null, "QR Code generated and stored successfully"));
    } catch (err) {
        res.status(500).json(createResult(err.message));
    }
});